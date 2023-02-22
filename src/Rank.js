import React, { useState, useEffect } from 'react';
import Loading from './Loading.js';
import ListItem from './MemberItem.js';
import List from './Member.js';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const streakWeight = 200;
const pointWeight = 1;

const calculateTotalXPPoints = (points) => {
    let totalXPPoints = 0;
    const today = new Date();
    points.forEach(point => {
        const pointDate = new Date(point.date * 1000);
        if (pointDate < today) {
            totalXPPoints += point.gainedXp;
        }
    });
    return totalXPPoints;
};

function getMissingDates(points) {
    let dates = points.map(point => point.readableDate);
    let dateObjects = dates.map(dateString => new Date(dateString));
    let missingDates = [];
    let currentDate = new Date(dateObjects[0]);

    while (currentDate < dateObjects[dateObjects.length - 1]) {
        currentDate.setDate(currentDate.getDate() + 1);
        if (!dateObjects.some(date => date.getTime() === currentDate.getTime())) {
            missingDates.push(new Date(currentDate));
        }
    }

    return missingDates.map(date => {
        let dateString = date.toLocaleDateString('en-US');
        return {
            date: Math.floor(date.getTime() / 1000),
            gainedXp: 0,
            readableDate: dateString,
        };
    });
}

function calculateStreak(points) {
    let streak = 0;
    points.forEach(point => {
        if (point.gainedXp > 0)
            streak++;
    });
    return streak;
}

function Rank() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUserInfo = async (member) => {
        const response = await fetch(`${BACKEND_URL}/${member}`);
        const data = await response.json();
        return data;
    }

    const fetchUserPoints = async (member) => {
        const response = await fetch(`${BACKEND_URL}/${member.id}/points`);
        const data = await response.json();
        return data;
    }

    useEffect(() => {
        const fetchData = async () => {
            const members = process.env.REACT_APP_MEMBERS.split(',');
            const memberInfo = await Promise.all(members.map(member => fetchUserInfo(member)));

            const memberData = memberInfo.map((member, index) => ({
                id: member.users[0].id,
                name: member.users[0].name,
                username: members[index],
                points: [],
                avatar: member.users[0].picture + '/xlarge',
                streak: 0,
                totalXPPoints: 0,
                totalPoints: 0
            }));

            const memberPoints = await Promise.all(memberData.map(member => fetchUserPoints(member)));
            memberPoints.forEach((points, index) => {
                memberData[index].points = points.summaries
                    .map(point => ({
                        date: point.date,
                        gainedXp: point.gainedXp || 0,
                        readableDate: new Date(point.date * 1000).toLocaleDateString(),
                    }))
                    .sort((a, b) => new Date(a.date) - new Date(b.date));

                let totalXPPoints = calculateTotalXPPoints(memberData[index].points);

                memberData[index].streak = calculateStreak(memberData[index].points);

                let missingDates = getMissingDates(memberData[index].points);
                memberData[index].points = [...memberData[index].points, ...missingDates];
                memberData[index].points = memberData[index].points.sort((a, b) => a.date - b.date);

                const totalPoints = (totalXPPoints + (memberData[index].streak * streakWeight)) * pointWeight;
                memberData[index].totalXPPoints = totalXPPoints;
                memberData[index].totalPoints = totalPoints;
            });

            memberData.sort((a, b) => b.totalPoints - a.totalPoints);

            let rank = 1;
            memberData.forEach((member, index) => {
                if (index > 0 && member.totalPoints < memberData[index - 1].totalPoints) {
                    rank += 1;
                }
                member.rank = rank;
            });

            console.log(memberData);
            setMembers(memberData);
            setLoading(false);
        }
        fetchData();
    }, []);

    return (
        loading ? (
            <Loading />
        ) : (
        <div className="container mx-auto">
            <div className="w-250 mx-auto">
                <article className="p-4 sm:p-6 lg:p-4 xl:p-6 space-x-4 items-start sm:space-x-6 lg:space-x-4 xl:space-x-6 flex justify-start">
                    <div class="basis-1/6 self-center text-center"><span class="text-xl font-medium text-gray-500">Rank</span></div>
                    <div class="basis-full"></div>
                    <div class="basis-1/6 self-center text-center">
                        <span class="text-xl font-medium text-gray-500">Streak</span>
                    </div>
                    <div class="basis-1/6 self-center text-center">
                        <span class="text-xl font-medium text-gray-500">Exp.</span>
                    </div>
                </article>
                <List>
                    {members && members.map(member => (
                        <ListItem key={member.id} member={member} />
                    ))}
                </List>
            </div>
        </div>
    ));
}

export default Rank;
