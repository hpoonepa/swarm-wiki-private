"use client";

import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { ScrollArea } from "../components/ui/scroll-area";

export default function Component() {
  // Calculate the number of columns for the grid (should match grid-cols-4 for lg, grid-cols-3 for md, grid-cols-2 for base)
  // We'll use 4 columns for simplicity (desktop)
  const columns = 4;
  const lastRowStart = Math.floor(studentMembers.length / columns) * columns;

  return (
    <section className="pt-0 pb-4 lg:pt-0 lg:pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {studentMembers.map((member, idx) => {
            // Add extra margin to the last card in the second to last row
            const isSecondToLastRow = idx >= lastRowStart - columns && idx < lastRowStart;
            const isLastInSecondToLastRow = isSecondToLastRow && (idx + 1) % columns === 0;
            return (
                <div key={member.name} className={isLastInSecondToLastRow ? "mb-[175px]" : ""}>
                <MemberCard member={member} />
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {advisors.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface Member {
  name: string;
  imgSrc: string;
  description: string;
  role: string;
}

const MemberCard = ({ member }: { member: Member }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden p-0 h-[262px]">
        <CardContent className="p-0 h-[262px]">
          <Button
            variant="ghost"
            className="w-full h-[262px] p-0 hover:bg-transparent"
            onClick={() => setIsOpen(true)}
          >
            <div className="relative w-full h-[262px]">
              <img
                src={member.imgSrc}
                alt={member.name}
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-[#FFFCF3] p-2 text-left">
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
          <div className="flex">
            <div className="w-1/2 h-[500px]">
              <img
                src={member.imgSrc}
                alt={member.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="w-1/2 p-6 bg-[#FFFCF3]">
              <DialogHeader>
                <DialogTitle>{member.name}</DialogTitle>
                <DialogDescription>{member.role}</DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[380px] w-full pr-4 mt-4">
                <p>{member.description}</p>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const studentMembers = [
  {
    name: "Avani Karthik",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/avani-hs.webp",
    description: `Hi friends, I’m Avani Karthik! I’m a senior and this is my third year on Lambert iGEM. iGEM has given me the opportunity to learn so much about both synthetic biology and hardware and I am so excited to experience the 2025 Giant Jamboree in Paris. In my spare time, you will find me coaching tennis, hanging out with my friends, reading a book, or binging TV shows. I can’t wait to meet everyone at Jamboree!
`,
    role: "Captain",
  },
  {
    name: "Sean Lee",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/sean-hs.webp",
    description: `Hi guys! I’m Sean Lee, a senior at Lambert High School and this is my last year as a part of Lambert iGEM. When I’m not in the lab slaving away, you’ll probably see me eating Chinese food or watching movies from the 90s. I’ve recently been cutting out the caffeine but I’ll hopefully still be wide awake to burn a hole in my wallet shopping in Paris. I’ve met so many amazing people through iGEM and I can’t wait to see everyone at Grand Jamboree and showcase all of our hard work this year!  
`,
    role: "Captain",
  },
  {
    name: "Aiden Lee",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/aiden-hs.webp",
    description: `Hey guys! My name is Aiden Lee, I’m a sophomore and this is my first year on the Lambert iGEM team. Being able to work in the lab with my teammates and continue to explore synthetic biology on a deeper level has been an amazing experience. When I’m not trying to decipher plate reader error messages and vague protocols, you can find me on the tennis courts hitting serves or trying to get an extra hour of sleep. Can’t wait for Paris!
`,
    role: "Member",
  },
  {
    name: "Amy Jing",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/amy-hs.webp",
    description: `What’s up guys!! I’m Amy Jing, and I’m in my sophomore year of highschool. This is my first year on the Lambert iGEM team, and I’ve been so grateful to have the great opportunity that iGEM is. When in the lab, you’ll see me slaving away at wetlab and graphics ^^ But, when I’m free, I love to paint, drink matcha, and buy Labubus. J'ai hâte de te voir à Paris!
`,
    role: "Member",
  },
  {
    name: "Aria Im",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/aria-hs.webp",
    description: `Hello everyone! My name is Aria Im, and I am a current senior at Lambert High School. This is my second and last year participating in iGEM. Being a part of this competition has opened my eyes to the endless possibilities of biotech, and I’m incredibly excited to be here in Paris once again. This opportunity to exchange ideas and collaborate with like-minded iGEMers is truly inspiring, and I can’t wait to see where this journey takes us all!.
`,
    role: "Member",
  },
  {
    name: "Arjun Gulati",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/arjun-hs.webp",
    description: `Hi guys! My name is Arjun Gulati and I am a sophomore. This is my first year on the team, and it has already been one of the most rewarding experiences in my high school career. Being on iGEM has taught me many valuable skills, like running wetlab experiments, designing hardware in CAD, and coding the wiki! Throughout the year, I’ve enjoyed building something great with people I love, and I am excited to continue to do so in the future as well. When I’m not fixing a failed pipeline on GitLab, you can find me grinding Rocket League, listening to The Weeknd, or hanging out with friends. See you in Paris!`,
    role: "Member",
  },
  {
    name: "Claire Lee",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/claire-hs.webp",
    description: `Hi, I’m Claire!! I am a senior and this is my second year on Lambert iGEM. Since I’ve joined, I have learned a lot and worked with so many amazing people. I’ve had so much fun on this team and am so fortunate to have been a part of it. When I’m not praying for good wetlab results, I might be reading, trying new foods, or playing NYT games. So excited to meet everyone at the Grand Jamboree- À bientôt!`,
    role: "Therapeutics Lead",
  },
  {
    name: "Harsha Poonepalle", 
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/harsha-hs.webp",
    description: `Bonjour à tous! I’m Harsha, a current junior, and this is my second year on the team. In the lab, you can see me working on our software or coding our wiki. Being part of this team has taught me so much and has created some great memories. When I’m not coding, you can find me playing squash, watching football, or learning French. J'ai hâte de te voir au Jamboree. 
`,
    role: "Co-Captain",
  },
  {
    name: "Jeremy Chen",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/jeremy-hs.webp",
    description: `Hey y’all! I’m Jeremy Chen, current senior at Lambert High School and this is my second and final year on the Lambert iGEM team. Being a part of this team has let me learn so much and meet so many amazing people. You can find me in the lab either recalculating concentrations for a new reaction (for the 20th time) or editing team videos (-8 hours of sleep). On the side I like to watch cheesy k-dramas, play rhythm games or go for nature walks. See you guys in Paris!
`,
    role: "Cas12 Lead",
  },
  {
    name: "Jiwoo Han",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/jiwoo-hs.webp",
    description: `Hey! My name is Jiwoo, I am a junior and this is my first year on the team! In the lab, you might see me helping with wetlab or constantly scribbling graphics on my iPad! But otherwise, I enjoy collecting playing cards, reading sci fi books, and overconsumption. I’m really excited for Paris and meeting new people at Grand Jamboree!
`,
    role: "Member",
  },
  {
    name: "Julia Rho",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/julia-hs.webp",
    description: `Bonjour à tous! I’m Julia, the Human Practices lead of Lambert iGEM and also a second-time iGEMmer! Being part of iGEM has truly been one of the greatest experiences of my life, and I’ve had the chance to meet some of the most amazing people along the way! I LOVE making new friends, so if you see me around, come say hi! See yall in Paris :)`,
    role: "Human Practices Lead",
  },

  {
    name: "Keerthana Anumukonda",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/keerthana-hs.webp",
    description: `Hi everyone! I’m Keerthana, and this is my first year on the Lambert iGEM team. iGEM has been such an amazing experience so far, even if I am still waiting for the impostor syndrome to fade a little bit.. When I’m not in the lab, you can probably find me reading or out with friends. I’m so excited to meet you all in Paris!`,
    role: "Member",
  },
  {
    name: "Nishchai Chawla",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/nish-hs.webp",
    description: `Hey everyone, I’m Nishchai! This is my first year on the Lambert iGEM team, and it has been an unforgettable experience. The amount I’ve learned about synthetic biology is nothing short of amazing. I particularly love exploring developments in technology–particularly in graphics and artificial intelligence–and their applications in biotechnology! When not writing code and building software, I love to hang out with friends and listen to music!`,
    role: "Member",
  },
  {
    name: "Reva Badkundri",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/reva-hs.webp",
    description: `Hi everyone! My name is Reva Badkundri, and I am currently a senior on the team. This is my second year with Lambert iGEM as a part of the wetlab committee. Being a part of the team has taught me so much about synthetic biology and has given me the opportunity to meet so many amazing people. In my free time, I enjoy hanging out with friends, running, and baking. I am so excited to meet everyone at Jamboree this year!`,
    role: "RPA Lead",
  },
  {
    name: "Rohan Kaushik",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/rohan-hs.webp",
    description: `Hey guys! I’m Rohan, and this is my first year on the Lambert iGEM team! I’m a part of both the Human Practices and Wetlab committees, and being on the team has already been such an insane experience. In my free time, I love reading fantasy books, watching horror movies, and hanging out with my friends, even though I am constantly losing aura... Can’t wait to meet everyone at Jamboree!`,
    role: "Member",
  },
  {
    name: "Sahasra Tatavarti",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/sahasra-hs.webp",
    description: `Hey everyone! My name is Sahasra Tatavarti, and I’m a senior in my third year with Lambert iGEM. Being part of this team has given me the chance to meet incredible people at the Jamboree and pick up skills I never imagined I’d learn. Outside the lab, you can usually find me reading (pretty much anything I can get my hands on), baking, or spending way too much time listening to different artists. I can’t wait to connect with everyone at this year’s Jamboree! 
`,
    role: "Modeling Lead",
  },
  {
    name: "Sankalp Yeleti",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/sankalp-hs.webp",
    description: `Hey everyone! My name is Sankalp Yeleti. I’m a senior at Lambert, and this is my second year on the team. I work in human practices and a fun fact about me is I’ve been playing piano for 6-7 years now. I am super excited to meet everyone in Paris at Jamboree!`,
    role: "Member",
  },
  {
    name: "Shashwat Balamurali",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/shashwat-hs.webp",
    description: `Hey everyone! My name is Shashwat Balamurali, a junior at Lambert High School and this is my second year on the team! Being part of the team this year, I’ve gained amazing experiences by diving into both modeling and wet lab, collaborating with like-minded teammates, and building new skills and memories along the way. Outside of iGEM, I enjoy playing cricket and exploring different cultures from around the world! I’m eager to continue learning from my team and the broader iGEM community and I can’t wait to see everyone at Jamboree!`,
    role: "Co-Captain",
  },
  {
    name: "Veda Vudithyala",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/veda-hs.webp",
    description: `Hi!! My name is Veda Vudithyala, and I’m a junior on the team. This is my first year with Lambert iGEM and it’s already introduced me to so many cool experiences. When I’m not in the lab, I’m usually trying not to start a fire in the kitchen with my abominable cooking skills. I’m more than excited to meet everyone at Grand Jamboree, jusque-là!`,
    role: "Member",
  },
  {
    name: "Vedant Kalipatnapu",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/vedant-hs.webp",
    description: `Yoooo!!!! My name is Vedant Kalipatnapu, and I’m a junior on the team. This is my first year with Lambert iGEM, and I’ve learned and experienced so much since becoming a member in November. When I’m not working on things in the lab, I’m probably out trying new food with my friends, going to concerts, and reading books. I’m so excited to meet everyone at Jamboree and meet other teams who share the same love for synthetic biology as us!
`,
    role: "Co-Captain",
  },
];

const advisors = [
  {
    name: "Catherine Sharer",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/sharer-hs.webp",
    description: `This is my 3rd year as the primary advisor for Lambert iGEM and my 4th Jamboree. I have a BS in Chem/Biochem and over a decade of academic research experience at Emory, Georgia Tech, and UAB. I truly love supporting the team from hosting early morning meetings and late lab sessions, to troubleshooting wetlab and sourcing supplies. Working with these gifted high schoolers who are so genuinely passionate and utterly fearless in their desire to discover novel solutions to global problems is an absolute joy! My favorite part of advising is seeing the personal growth of the students both as scientists and as teammates. If I am not in the lab, I am probably catching up on something school or family related and trying to remember what hobbies I used to have before iGEM :)`,
    role: "Primary Investigator",
  },
  {
    name: "Cathy O'Haver",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/ohaver-hs.webp",
    description: `Bonjour!! My name is Catherine O’Haver and I am truly fortunate to help advise and support this incredible Lambert iGEM team for a second year. I have a clinical background in nursing and clinical research, and I am amazed to see the collaboration, creativity and passion that this Lambert team brings to the process in solving complex real world problems. It gives me great hope for the future of science and medicine. I am super excited about our team project this year, and I’m ready for my first cappuccino and croissant in Paris!`,
    role: "Advisor",
  },
  {
    name: "Jes O'Kelley",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/okelley-hs.webp",
    description: `I am an assistant principal at Lambert High School with 17 years of experience in education. I recently completed my doctoral studies in educational leadership. Though my background is  not in a STEM field, I have been supporting our Career Tech programs for two years, and it’s a privilege to see our students live out their passions and apply their skills to prepare for their future career and solve real world problems. I love working with our iGEM students, because they embody the perfect mix of intelligence, teamwork, and commitment. These students are truly special, and I enjoy every moment I get to spend with them. I am so proud to have this team represent Lambert in Paris this year! I look forward to watching them support one another as they compete, and I am honored to play even a small role in their success. Hook ‘em!`,
    role: "Advisor",
  },
  {
    name: "Esther Lee",
    imgSrc: "https://static.igem.wiki/teams/5612/teampage/members/esther-hs.webp",
    description: `I'm an undergrad at Georgia Tech studying biomedical engineering and a former member of Lambert iGEM 2022. Each year, it's amazing to see what exciting project Lambert iGEM builds, and I enjoy supporting the team where I can. I admire the dedication the students have in solving a problem using synbio, and I know how rewarding it is to work with a team and grow together as researchers. I hope this passion never dies. In my free time, I like to just stay in my bed or go try new food!.`,
    role: "Advisor",
  },
];
