import { Tooltip } from "flowbite-react";
import GoldCup from "./images/gold-cup.png";
import SilverCup from "./images/silver-cup.png";
import BronzeCup from "./images/bronze-cup.png";
import { Animated } from "react-animated-css";


export default function Member({ member }) {
    let styleAvatar = (avatar) => {
        return {
            background: `linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%), url(${avatar})`,
            backgroundSize: "cover",
        };
    };

    let Cheeries = [
        "You're doing great!",
        "Keep up the good work!",
        "You're a rockstar!",
        "You're a legend!",
        "You're a superstar!",
        "You're a champion!",
        "On fire!",
        "Outstanding!",
        "Keep it up!",
    ]

    let FirstAvatar = member.avatar.replace("xlarge", "xxlarge");
    let FirstComment = `${member.name} is the current leader with ${member.totalXPPoints} points. ${Cheeries[Math.floor(Math.random() * Cheeries.length)]}`;
    let SecondaryComment = `${member.name} is the current second place with ${member.totalXPPoints} points. ${Cheeries[Math.floor(Math.random() * Cheeries.length)]}`;
    let ThirdComment = `${member.name} is the current third place with ${member.totalXPPoints} points. ${Cheeries[Math.floor(Math.random() * Cheeries.length)]}`;

    let memberContent;
    if (member.rank === 1) {
        memberContent = (
            <div className="basis-1/2">
                <Tooltip
                    content={FirstComment}
                    style="dark"
                    placement="bottom"
                >
                    <Animated animationIn="fadeInUp" animationInDuration="1500" animationInDelay="1000" isVisible={true}>
                        <div class="relative mb-8">
                            <div class="w-10/12 h-auto rounded-full mx-auto" style={styleAvatar(FirstAvatar)}>
                                <img alt={member.name} class="rounded-full mx-auto mb-3  border-8 border-emerald-500 p-1 z-10 invisible" src={FirstAvatar} />
                            </div>
                            <div class="absolute bottom-0 w-full">
                                <img  alt={member.name} src={GoldCup} class="w-20 mx-auto" style={{ marginBottom: "-20px" }} />
                            </div>
                        </div>
                        <h2 class="lg:text-2xl text-xl text-emerald-600 font-medium">{member.name}</h2>
                    </Animated>
                </Tooltip>
            </div>
        );
    } else {
        memberContent = (
            <div className={member.rank === 2 ? "basis-1/4 self-end order-first" : "basis-1/4 self-end"}>
                <Tooltip
                    content={member.rank === 2 ? SecondaryComment : ThirdComment}
                    style="dark"
                    placement="bottom"
                >
                    <Animated animationIn="fadeInUp" animationInDuration="1000" isVisible={true}>
                        <div class="relative mb-8">
                            <div class="w-10/12 h-auto rounded-full mx-auto" style={styleAvatar(member.avatar)}>
                                <img  alt={member.name} class="rounded-full mx-auto mb-3  border-8 border-emerald-500 p-1 z-10 invisible" src={member.avatar} />
                            </div>
                            <div class="absolute bottom-0 w-full">
                                {member.rank === 2 ? (
                                    <img alt="Silver cup"  src={SilverCup} class="md:w-12 w-10 mx-auto" style={{ marginBottom: "-20px" }} />
                                ) : (
                                    <img alt="Bronze cup"  src={BronzeCup} class="md:w-12 w-10 mx-auto" style={{ marginBottom: "-20px" }} />
                                )}
                            </div>
                        </div>
                        <h2 class="text-emerald-600 font-medium whitespace-nowrap">{member.name}</h2>
                    </Animated>
                </Tooltip>
            </div>
        );
    }

    memberContent = (
        <a href={`https://www.duolingo.com/profile/${member.username}`} class="contents text-center" target="_blank" rel="noreferrer">{memberContent}</a>
    );

    return (memberContent);
}