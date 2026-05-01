// tone: 'base' | 'muted' | 'elevated' | 'accent' | 'image'
// span: [colSpan, rowSpan]
// level: 'h2' → large serif chapter heading; default → small-caps sub-label
// type: 'video' → Vimeo responsive embed
// body: separate paragraphs with \n\n

export const portfolioData = {
  id: 'root',
  type: 'grid',
  label: 'Chengchang Qian',
  items: [
    {
      id: 'hero',
      type: 'page',
      label: 'Chengchang Qian',
      span: [2, 1],
      tone: 'elevated',
      illustration: 'vectorly-UNI-compass',
      content: {
        type: 'hero',
        role: 'Product Designer',
        location: 'San Francisco Bay Area',
        bio: 'I design digital products that help people work smarter. Currently at LinkedIn, where I build AI-powered tools for sales professionals.',
        tags: ['Product Design', 'UX Research', 'AI/ML Products', 'Design Systems'],
      },
    },

    // ── Projects ──────────────────────────────────────────────────────────────
    {
      id: 'projects',
      type: 'grid',
      label: 'Projects',
      span: [2, 1],
      tone: 'base',
      badgeLabel: 'case studies',
      illustration: 'vectorly-UNI-chart-magnifier',
      items: [

        // ── AI-Native Vision ─────────────────────────────────────────────────
        {
          id: 'project-ai-vision',
          type: 'page',
          label: 'AI-Native Vision',
          span: [2, 1],
          tone: 'accent',
          content: {
            type: 'project',
            tagline: 'Rethinking the interface for AI-native workflows',
            year: '2024',
            role: 'Lead Designer',
            timeline: 'In progress',
            team: 'TBD',
            tools: 'Figma',
            tags: ['AI/ML', 'Vision', 'In Progress'],
            sections: [
              { level: 'h2', heading: 'The Question', body: 'Most "AI features" today are search boxes and suggestion panels grafted onto existing UI. What would a product look like if it were designed from the ground up assuming the AI does most of the cognitive work?' },
              { level: 'h2', heading: 'Status', body: 'Early exploration and synthesis underway. More to come.' },
            ],
          },
        },

        // ── Account IQ ────────────────────────────────────────────────────────
        {
          id: 'project-account-iq',
          type: 'page',
          label: 'Account IQ',
          span: [2, 1],
          tone: 'base',
          image: '/images/projects/account-iq.png',
          content: {
            type: 'project',
            heroImage: '/images/projects/account-iq-hero.png',
            tagline: 'AI-powered account overview to help sellers save time in conducting account research',
            year: '2023',
            role: 'Lead designer',
            timeline: 'Jul 2023 – Dec 2023',
            team: '1 PM, 1 designer, 5 engineers',
            tools: 'Figma, FigJam',
            tags: ['AI/ML', 'B2B', 'LinkedIn'],
            sections: [
              {
                level: 'h2',
                heading: 'What is Account IQ?',
                body: 'On Dec 6, 2023, I helped launch the Account IQ feature to all users on LinkedIn Sales Navigator. This new feature uses GenAI to consolidate in one place everything a sales rep needs to know about their target accounts: financials, strategic priorities, pain points, what leaders are talking about on LinkedIn, and more.\n\nAccount IQ allows salespeople to get prepared for a customer call in just a few minutes — what used to take hours of research. This project is one of the highlighted LinkedIn GAI projects in LinkedIn\'s strategy to deliver AI-powered, tailored advice and guidance to every member and customer through each of our products.',
              },
              {
                level: 'h2',
                heading: 'My Role',
                body: 'As the lead designer on the team, I collaborated with my product partner to create a clear product roadmap and negotiated feature priorities for launch in various stages.\n\nI partnered with user research and PMM to run user testing and surveys to uncover insights and quickly gather feedback to help design iterations. I presented my designs to gain approval from senior stakeholders in both design and product, and prepared materials for presentation to the LinkedIn CEO and CPO.\n\nI designed user flows, wireframes, hi-fi prototypes and collaborated with engineers and PM to ensure a smooth handoff.',
              },
              {
                level: 'h2',
                heading: 'Outcome and Impact',
                type: 'metrics',
                items: [
                  { value: '$22.6M', label: 'New customer acquisition in 2 months' },
                  { value: '86%',    label: 'CSAT score' },
                  { value: '86%',    label: 'Thumbs-up engagement rate' },
                  { value: '50+',    label: 'Media articles at launch' },
                ],
                body: 'Account IQ is the biggest revenue-driving GenAI investment across all of LinkedIn. Sellers started booking more meetings, prospects were impressed by their depth of knowledge, and sellers were considering replacing other sales tools.',
              },
              {
                level: 'h2',
                heading: 'Contact Me to Learn More',
                body: "To comply with my non-disclosure agreement, I've omitted and obfuscated all the details and confidential information in this case study. Please reach out to me if you'd like to learn more about the full case study for this project.",
              },
            ],
          },
        },

        // ── LinkedIn Design Challenge ─────────────────────────────────────────
        {
          id: 'project-linkedin-ask',
          type: 'page',
          label: 'LinkedIn Design Challenge',
          span: [1, 1],
          tone: 'muted',
          image: '/images/projects/linkedin-ask.jpg',
          content: {
            type: 'project',
            heroImage: '/images/projects/linkedin-ask-hero.jpg',
            tagline: 'Overcome the barriers for novice contributors to share on LinkedIn',
            year: '2019',
            role: 'UX designer, UX researcher and prototyper',
            timeline: 'Jan 17–21, 2019 (5 days)',
            team: 'Solo project',
            tools: 'Figma, Sketch, Adobe Photoshop, ScreenFlow',
            tags: ['Mobile', 'Social', 'UX Research'],
            sections: [
              {
                level: 'h2',
                heading: 'Design Prompt',
                body: 'LinkedIn enables professionals to be more productive and successful by helping them stay informed and build meaningful relationships. A productive content ecosystem relies on a healthy balance of content contributors and consumers that share and learn knowledge about their industries, careers and professional interests. For many members, however, it feels scary or risky to contribute to the platform since their actions are tied to their professional identities.\n\nTask: Design an experience that helps novice contributors overcome the barriers to sharing.',
              },
              {
                level: 'h2',
                heading: 'Final Design',
                type: 'video',
                src: 'https://player.vimeo.com/video/390843638?quality=1080p',
              },
              {
                type: 'gallery',
                carousel: true,
                aspectRatio: '3/4',
                images: [
                  { id: 'li-screen1', src: '/images/projects/linkedin-ask-screen1.jpg', caption: 'Screen 1' },
                  { id: 'li-screen2', src: '/images/projects/linkedin-ask-screen2.jpg', caption: 'Screen 2' },
                  { id: 'li-screen3', src: '/images/projects/linkedin-ask-screen3.jpg', caption: 'Screen 3' },
                  { id: 'li-screen4', src: '/images/projects/linkedin-ask-screen4.jpg', caption: 'Screen 4' },
                ],
              },
              {
                level: 'h2',
                heading: 'Design Process',
                type: 'image',
                id: 'li-design-process',
                src: '/images/projects/linkedin-ask-design-process.jpg',
                caption: 'My design process: Empathise → Define → Ideate → Prototype',
              },
              { level: 'h2', heading: 'Empathise' },
              {
                heading: 'Questions',
                body: 'I started decoding the design prompt by asking a few questions below. These questions can help me clarify the area that I want to gather insights from in the user research.',
                type: 'image',
                id: 'li-questions',
                src: '/images/projects/linkedin-ask-questions.png',
                caption: 'Initial research questions',
              },
              {
                heading: 'User Survey',
                body: 'Based on my initial questions and thoughts on why users consume or contribute on LinkedIn, I designed a 13-question user survey and received 22 valid responses sent to a wide variety of LinkedIn users.\n\nOnly 22.7% of users rarely consume LinkedIn Feeds, and everyone has consumed them before. On the other hand, 81.8% of users rarely or never post LinkedIn Feeds. So these users fit perfectly as my target users — novice contributors who consume content but are not contributing.\n\nThe survey is aimed at giving a general understanding of my target users and learning their barriers to sharing on LinkedIn.',
              },
              {
                type: 'gallery',
                carousel: true,
                aspectRatio: '4/3',
                images: [
                  { id: 'li-q1',  src: '/images/projects/linkedin-ask-q1.jpg',  caption: 'Q1' },
                  { id: 'li-q2',  src: '/images/projects/linkedin-ask-q2.jpg',  caption: 'Q2' },
                  { id: 'li-q3',  src: '/images/projects/linkedin-ask-q3.jpg',  caption: 'Q3' },
                  { id: 'li-q4',  src: '/images/projects/linkedin-ask-q4.jpg',  caption: 'Q4' },
                  { id: 'li-q5',  src: '/images/projects/linkedin-ask-q5.jpg',  caption: 'Q5' },
                  { id: 'li-q6',  src: '/images/projects/linkedin-ask-q6.jpg',  caption: 'Q6' },
                  { id: 'li-q7',  src: '/images/projects/linkedin-ask-q7.jpg',  caption: 'Q7' },
                  { id: 'li-q8',  src: '/images/projects/linkedin-ask-q8.jpg',  caption: 'Q8' },
                  { id: 'li-q9',  src: '/images/projects/linkedin-ask-q9.jpg',  caption: 'Q9' },
                  { id: 'li-q10', src: '/images/projects/linkedin-ask-q10.jpg', caption: 'Q10' },
                  { id: 'li-q11', src: '/images/projects/linkedin-ask-q11.jpg', caption: 'Q11' },
                  { id: 'li-q12', src: '/images/projects/linkedin-ask-q12.jpg', caption: 'Q12' },
                ],
              },
              {
                heading: 'User Interviews',
                body: 'Having all the survey results, I recruited 3 users from the survey to conduct more in-depth user interviews through Google Hangouts. These users all fall into the group of novice contributors, but they have different concerns and pain points.\n\nThese user interviews helped me gather insights that I missed from the survey — for example, what are the reasons behind their barriers to sharing? What could encourage them to contribute more? What kind of content brings true value to them?',
              },
              {
                type: 'image',
                id: 'li-interview',
                src: '/images/projects/linkedin-ask-interview.jpg',
                caption: 'User interview sessions via Google Hangouts',
              },
              {
                body: 'Below are highlights of what they said. Names and avatars are faked for privacy.',
                type: 'image',
                id: 'li-interview-highlight',
                src: '/images/projects/linkedin-ask-interview-highlight.jpg',
                caption: 'User interview highlights',
              },
              { level: 'h2', heading: 'Define' },
              {
                heading: 'Affinity Diagram',
                body: 'I created an affinity diagram based on all my survey and interview data to organize and visualize my key insights.\n\nThe core reasons that users don\'t post on LinkedIn can be broken into 4 different pressures: pressure from limited information, pressure to express myself, pressure from professional identity, and pressure from social networking. The first two pressures come from internal sources and the latter two from external sources.\n\nThere are three primary reasons users want to become contributors: gain knowledge, build connection, and career development.',
                type: 'image',
                id: 'li-affinity',
                src: '/images/projects/linkedin-ask-affinity.jpg',
                caption: 'Affinity diagram — all survey and interview data organized into key insights',
              },
              {
                heading: 'Personas',
                body: 'Combined with these 4 pressures and 3 reasons, I created a persona that can better tell the story. Meet Annie.',
                type: 'image',
                id: 'li-persona',
                src: '/images/projects/linkedin-ask-persona.jpg',
                caption: 'Persona — Annie, the novice LinkedIn contributor',
              },
              {
                heading: 'Design Goal',
                body: 'Equipped with the persona and all my research insights, below is my design goal: to help break the barriers for novice contributors.',
                type: 'image',
                id: 'li-design-goal',
                src: '/images/projects/linkedin-ask-process.jpg',
                caption: 'Design goal framework',
              },
              { level: 'h2', heading: 'Ideate' },
              {
                heading: 'Hook Model',
                body: 'Before I start to brainstorm and ideate solutions, this typical "user generate content" problem in a social platform reminded me of a book I had read before — Hooked: How to Build Habit-Forming Products by Nir Eyal.\n\nIn the book, Nir introduced the hook model, which describes how businesses can fundamentally change behavior within their users and create day-to-day habits around their products. The hook model contains 4 parts: Trigger → Action → Variable Reward → Investment.\n\nI think the hook model could be very helpful when brainstorming ideas, because I am trying to establish a routine behavior (contributing content) for novice contributors.',
                type: 'image',
                id: 'li-hook',
                src: '/images/projects/linkedin-ask-hook.jpg',
                caption: 'Hook Model applied to our design problem',
              },
              {
                heading: 'Brainstorming',
                body: 'Taking my design goal in mind along with the hook model, I started asking HMW questions for ideation.',
              },
              {
                type: 'gallery',
                images: [
                  { id: 'li-hmw1', src: '/images/projects/linkedin-ask-hmw1.jpg', caption: 'HMW questions — round 1' },
                  { id: 'li-hmw2', src: '/images/projects/linkedin-ask-hmw2.jpg', caption: 'HMW questions — round 2' },
                ],
              },
              {
                body: 'After analyzing pros and cons for all ideas, I found two ideas that kept popping up in almost all the HMW categories. I decided to combine these 2 ideas and bring them to life: LinkedIn Ask — a new Q&A section where users can ask and answer questions anonymously within specific topics and interests.',
              },
              {
                heading: 'Low Fidelity Sketches & Wireframes',
                body: 'I started sketching out key screens that cover the above features. The screens can be further broken into 6 categories: onboarding, topic discovery, topic page, question page, ask question, and connect.',
              },
              {
                type: 'gallery',
                images: [
                  { id: 'li-sketch1', src: '/images/projects/linkedin-ask-sketch1.jpg', caption: 'Sketch explorations — set 1' },
                  { id: 'li-sketch2', src: '/images/projects/linkedin-ask-sketch2.jpg', caption: 'Sketch explorations — set 2' },
                  { id: 'li-sketch3', src: '/images/projects/linkedin-ask-sketch3.jpg', caption: 'Sketch explorations — set 3' },
                ],
              },
              {
                heading: 'User Flow',
                body: 'I also created a user flow for LinkedIn Ask, illustrating how users interact through different screens, and how this ties back to our design goal.',
                type: 'image',
                id: 'li-userflow',
                src: '/images/projects/linkedin-ask-userflow.jpg',
                caption: 'LinkedIn Ask user flow',
              },
              { level: 'h2', heading: 'Prototype' },
              {
                heading: 'Hi-Fi Prototype',
                body: 'Annie is an entry-level UX designer with 2 years of working experience. She is passionate about what she does. Even though she is currently working in a local startup, she wants to grow to be an influential design leader in the future.\n\nAnnie likes looking for jobs or browsing for interesting industry articles on LinkedIn mobile. As usual, she surprisingly found a set of newly designed onboarding screens on her LinkedIn app.\n\nShe entered the home page, then she saw a guide inviting her to try out LinkedIn Ask. She clicked into that tab and found she can discover and manage topics that are interesting to her — which is something she always wanted.\n\nShe explored topics and chose Figma Topic to follow, because that\'s a UI design tool she recently picked up.\n\nBack in the Figma questions list, she got inspired to post a question: "What are some good learning materials to get started on Figma?" She found that asking a question anonymously with a topic tag is so much easier than posting a public article or status update.\n\nFinally, Annie was surprised to find out she could also connect with users who were actively contributing to this topic. She can learn from the talents in her industry now, and eventually become one of them.',
                type: 'video',
                src: 'https://player.vimeo.com/video/390843638?quality=1080p',
              },
              {
                type: 'image',
                id: 'li-allscreens',
                src: '/images/projects/linkedin-ask-allscreens.jpg',
                caption: 'LinkedIn Ask — all screens overview',
              },
              {
                level: 'h2',
                heading: 'Future Work',
                body: 'Because of the time limitation, I didn\'t have time to conduct proper user testing sessions. User testing could help me keep refining my design, and there are still many areas that need me to think through and work on in the future.',
              },
              {
                level: 'h2',
                heading: "What I've Learned",
                body: 'This was an exciting, exhausting but fully valuable experience. It is always fun to enjoy the entire end-to-end design journey and see how I gradually reach my design goal.\n\nA great product should not only solve the pain points of target users but also nudge them toward a desired behavior. LinkedIn Ask uses the Hook Model to gradually shift users from consuming to contributing — removing friction at each step and making the transition feel natural and rewarding.',
                type: 'image',
                id: 'li-timeline',
                src: '/images/projects/linkedin-ask-timeline.jpg',
                caption: '5-day design sprint timeline',
              },
              {
                type: 'image',
                id: 'li-thankyou',
                src: '/images/projects/linkedin-ask-thankyou.gif',
                caption: 'Thank you',
              },
            ],
          },
        },

        // ── Scenario Listing ──────────────────────────────────────────────────
        {
          id: 'project-scenario',
          type: 'page',
          label: 'Scenario Listing',
          span: [1, 1],
          tone: 'elevated',
          image: '/images/projects/scenario.jpg',
          content: {
            type: 'project',
            heroImage: '/images/projects/scenario-hero.jpg',
            tagline: 'Rethinking how to find and organize Scenarios in MMM app',
            year: '2017',
            role: 'UX designer and prototyper',
            timeline: 'Mar 2017 – Jun 2017',
            team: '2 product managers, 4 engineers, me',
            tools: 'Sketch, Figma, Principle, InVision, Adobe Illustrator',
            tags: ['Enterprise', 'B2B SaaS', 'Data'],
            sections: [
              {
                level: 'h2',
                heading: 'What is MMM?',
                body: 'MMM (Marketing Mix Modeling) is an important technique in Marketing Analytics. It helps know which marketing channels contribute to your business outcomes — refine campaigns on the fly and use predictive models to test future scenarios.\n\nNeustar MMM is a collaborative analytics application built on this technique. It uses interactive and forward-looking custom models to predict outcomes based on marketing and non-marketing business drivers. Users can review business performance, create quarterly and annual marketing plans, and answer ad hoc questions.',
              },
              {
                level: 'h2',
                heading: 'What is Scenario Listing?',
                body: 'Plan and Optimize is the core feature of the Neustar MMM platform. Users create scenarios — sets of assumptions about marketing and non-marketing business drivers — to test potential outcomes of marketing decisions or review optimization recommendations.',
                type: 'image',
                id: 'sc-mmm',
                src: '/images/projects/scenario-mmm.jpg',
                caption: 'Neustar MMM — Plan & Optimize overview',
              },
              {
                body: 'Scenario Listing is the primary navigation for the Plan & Optimize area. As the designer for this project, I was asked to rethink how our users interact with Scenarios in their daily workflow to better support their analysis needs.',
              },
              {
                level: 'h2',
                heading: 'Who Am I Designing For?',
                body: 'To answer this question, the design team interviewed both internal TPMs (Technical Product Managers) and external client users, observed how they use our products, understood their day-to-day workflows, and consolidated all findings into 3 personas.',
              },
              {
                level: 'h2',
                heading: "Let's Meet Jill, Liz and Pete",
              },
              {
                heading: 'Jill',
                type: 'image',
                id: 'sc-jill',
                src: '/images/projects/scenario-jill.png',
                caption: 'Jill — CMO',
              },
              {
                body: 'Jill is the CMO of the company. She wants to maximize corporate profits and efficiency by leveraging their corporate data with the best tools.\n\nShe uses MMM to get a pulse of marketing performance and impact on business, set high-level budget and easily test hypotheses, get notified on opportunities and risks, and understand which channels have the highest ROI.',
              },
              {
                heading: 'Liz',
                type: 'image',
                id: 'sc-liz',
                src: '/images/projects/scenario-liz.png',
                caption: 'Liz — Director of Marketing Analytics & Insights',
              },
              {
                body: "Liz is the Director of Marketing Analytics & Insights under Jill. She manages spend across multiple channels and needs to plan budget allocation on a month-to-month basis.\n\nShe uses MMM to react to business requests from peers and managers, identify optimization opportunities, understand what's working and what's not working across channels, and understand how to re-allocate budget across channels.",
              },
              {
                heading: 'Pete',
                type: 'image',
                id: 'sc-pete',
                src: '/images/projects/scenario-pete.jpg',
                caption: 'Pete — Manager of Marketing Insights',
              },
              {
                body: 'Pete is the Manager of Marketing Insights. He works under Jill and manages only one channel. He needs to provide measurement and insights regarding marketing campaigns, and provides recommendations on budget allocation.\n\nHe uses MMM to produce quality analysis rapidly, manage analysis in one location, and respond to mandates from Jill.',
              },
              {
                level: 'h2',
                heading: "Pete's Challenge",
                body: "Jill oversees the entire business strategy, Liz manages across channels and plans budget allocation, and Pete responds to ad hoc requests from various stakeholders.\n\nApparently, Pete is the one who does all the tactical work, and Scenario Listing will benefit him the most.\n\nHis challenges: it's difficult to manage, understand and remember Scenarios. He doesn't know what changes have been made to Scenarios or what the key insights are. It is hard to manage and organize Scenarios quickly to develop large-scale analysis — his primary task throughout the day.",
              },
              {
                level: 'h2',
                heading: 'What Problems Are They Facing?',
                body: 'After getting a better understanding of the goal and the key persona, I targeted all the pain points they had. I used FullStory in addition to direct observation to capture all sessions in the current Scenario Listing page and observe where users face challenges.',
                type: 'image',
                id: 'sc-oldpage',
                src: '/images/projects/scenario-oldpage.jpg',
                caption: 'Current Scenario Listing page — before redesign',
              },
              {
                heading: 'Pain Point 1',
                body: 'Users rarely interact with the charts on the right side, which takes up two thirds of the page. It was originally designed to help compare multiple scenarios and view the impact of business changes.',
                type: 'image',
                id: 'sc-pain1',
                src: '/images/projects/scenario-pain1.jpg',
              },
              {
                heading: 'Pain Point 2',
                body: 'Users keep scrolling rather than searching. Finding a scenario they want generally takes a long time.',
                type: 'image',
                id: 'sc-pain2',
                src: '/images/projects/scenario-pain2.jpg',
              },
              {
                heading: 'Pain Point 3',
                body: "All the metadata for the scenarios is grouped in limited space. The UI doesn't show what each field means, and very often the metadata for different scenarios could be very similar — so users need to click into each one to understand what is different.",
                type: 'image',
                id: 'sc-pain3',
                src: '/images/projects/scenario-pain3.jpg',
              },
              {
                heading: 'Pain Point 4',
                body: 'The scenarios are grouped into three rigid sections (My Scenarios, Current Plan & Recommendations, Shared Scenarios). Users generally want a more flexible way to organize scenarios in their workflow.',
                type: 'image',
                id: 'sc-pain4',
                src: '/images/projects/scenario-pain4.jpg',
              },
              {
                heading: 'Pain Point 5',
                body: 'There are too many exit points on this page in different styles (New Scenarios, Constraints, View Detailed Results, Edit Scenarios). Users spend a lot of time hovering over those links and buttons to figure out what they do.',
                type: 'image',
                id: 'sc-pain5',
                src: '/images/projects/scenario-pain5.jpg',
              },
              {
                level: 'h2',
                heading: 'What Should Scenario Look Like?',
                body: "It's easy to want to fit all information related to Scenarios on this page, but then it would be no different than a huge spreadsheet. Showing just sufficient information and providing good visual hierarchy is the key.\n\nOne finding from observation: users generally put the most important and distinctive information in the scenario name so they can find scenarios quickly. So I collected scenario names from all clients to learn what information they care about most and how many scenarios they need to organize.",
              },
              {
                type: 'gallery',
                images: [
                  { id: 'sc-json',   src: '/images/projects/scenario-json.jpg',   caption: 'Scenario names from all clients' },
                  { id: 'sc-client', src: '/images/projects/scenario-client.jpg', caption: 'Client analysis' },
                ],
              },
              {
                body: 'Then I tried out lots of different layouts based on this list, focusing on the visual hierarchy of the scenario. You can see the evolution of the layouts below.',
                type: 'image',
                id: 'sc-structure',
                src: '/images/projects/scenario-structure.jpg',
                caption: 'Layout evolution — from sketch to structure',
              },
              {
                level: 'h2',
                heading: 'Introducing the New Scenario Listing Page',
              },
              {
                heading: 'Easy to Organize',
                body: 'The new listing page gives you the flexibility to organize Scenarios in your own way — you can create folders and assign scenarios to those folders.',
                type: 'video',
                src: 'https://player.vimeo.com/video/382706253?quality=2k&autoplay=1&loop=1&autopause=0&muted=1',
              },
              {
                heading: 'Clean Visual Hierarchy',
                body: 'The new layout for scenarios is very easy to consume. Information is placed in a good hierarchy that makes it easy to scan at a glance.',
                type: 'video',
                src: 'https://player.vimeo.com/video/382717355?quality=2k&autoplay=1&loop=1&autopause=0&muted=1',
              },
              {
                heading: 'Less is More',
                body: 'Secondary information like actions and calculation status are hidden by default. You can reveal them when hovering over the scenario card.',
                type: 'video',
                src: 'https://player.vimeo.com/video/382717716?quality=2k&autoplay=1&loop=1&autopause=0&muted=1',
              },
              {
                heading: 'No More Scroll, Just Search',
                body: 'The new smart search function covers all metadata for your scenarios. You can search keywords like scenario name, folder name, scenario type, or creator name to instantly find what you want.',
                type: 'video',
                src: 'https://player.vimeo.com/video/382718226?quality=2k&autoplay=1&loop=1&autopause=0&muted=1',
              },
              {
                level: 'h2',
                heading: 'Keep It Consistent',
                body: 'The style for the Scenario Listing page is based on the style guide I created for the MMM application to keep all app elements and components consistent, organized, and available to the team at all times.',
              },
              {
                type: 'gallery',
                carousel: true,
                aspectRatio: '16/9',
                images: [
                  { id: 'sc-ds-space-inset',  src: '/images/projects/scenario-ds-space-inset.png',  caption: 'Space — Inset' },
                  { id: 'sc-ds-space-stack',  src: '/images/projects/scenario-ds-space-stack.png',  caption: 'Space — Stack & Inline' },
                  { id: 'sc-ds-color',        src: '/images/projects/scenario-ds-color.png',        caption: 'Color' },
                  { id: 'sc-ds-typography',   src: '/images/projects/scenario-ds-typography.png',   caption: 'Typography' },
                  { id: 'sc-ds-forms',        src: '/images/projects/scenario-ds-forms.png',        caption: 'Forms' },
                  { id: 'sc-ds-dropdowns',    src: '/images/projects/scenario-ds-dropdowns.png',    caption: 'Dropdowns' },
                  { id: 'sc-ds-buttons',      src: '/images/projects/scenario-ds-buttons.png',      caption: 'Buttons' },
                  { id: 'sc-ds-table',        src: '/images/projects/scenario-ds-table.png',        caption: 'Table' },
                  { id: 'sc-ds-notif',        src: '/images/projects/scenario-ds-notifications.png', caption: 'Notifications' },
                  { id: 'sc-ds-icons',        src: '/images/projects/scenario-ds-icons.png',        caption: 'Icons' },
                ],
              },
              {
                level: 'h2',
                heading: 'Outcome and Impact',
                type: 'metrics',
                items: [
                  { value: '180',    label: 'Active accounts' },
                  { value: '31,385', label: 'Annual page views (2019)' },
                  { value: '11 min', label: 'Avg. daily session per user' },
                ],
                body: 'This page became the most frequently used page across the entire MMM application and the navigation hub for the entire app. Clients called it the most intuitive feature among all feature updates.',
              },
              {
                level: 'h2',
                heading: "What I've Learned",
                body: "It's important to find the primary users you're designing for, especially for B2B products. The users you sell to may not be the users who use the product daily.\n\nI minimized cognitive load throughout: only exposing the information users need to make decisions, limiting available options on the page, and considering visual and content simplicity at every step.",
              },
            ],
          },
        },

        // ── Lighthouse ────────────────────────────────────────────────────────
        {
          id: 'project-lighthouse',
          type: 'page',
          label: 'Lighthouse',
          span: [1, 1],
          tone: 'base',
          image: '/images/projects/lighthouse.jpg',
          content: {
            type: 'project',
            heroImage: '/images/projects/lighthouse-hero.jpg',
            tagline: 'Perfecting tool for data collection and validation',
            year: '2018',
            role: 'UX designer and prototyper',
            timeline: 'Mar 2018 – Aug 2018',
            team: '1 PM, 4 engineers, 2 data strategists, me',
            tools: 'Sketch, Principle, InVision Studio',
            tags: ['Enterprise', 'Data', 'B2B'],
            sections: [
              {
                level: 'h2',
                heading: 'What is Lighthouse?',
                body: 'Through a couple of rounds of iterations, I redesigned a tool called Lighthouse to help our clients submit better quality data and have a better understanding of the data collection and validation process during their onboarding.',
              },
              {
                level: 'h2',
                heading: 'Why We Need Lighthouse?',
                body: "At Neustar, to build the most accurate and effective attribution models, it's important to capture as many events as possible that our customers have with their brand. So it is very important to pull in data from many different sources — TV, radio, digital media, CRM, and more.",
                type: 'image',
                id: 'lh-intro-journey',
                src: '/images/projects/lighthouse-intro-journey.gif',
                caption: 'The complexity of a client\'s data journey — many sources, many gaps',
              },
              {
                body: "Our data team needs a tool to help bridge the gap between what our clients can provide and what we expect to receive. This also contributes to our end goal of automating the entire process and greatly shortening client onboarding time.\n\nAs the UX designer for this project, I am responsible for redesigning the whole experience of data collection and data validation.",
              },
              {
                level: 'h2',
                heading: 'Who Am I Designing For?',
                body: 'Our data strategists — who expect to receive high-quality data from clients and need to validate it before passing it to modelers.\n\nAnd our clients — who want a portal to send all their data easily and fast, so they can start using our marketing analysis tools as soon as possible.',
              },
              {
                level: 'h2',
                heading: 'What Problems Are They Facing?',
                body: 'I interviewed 5 data strategists in our data team, each of whom had worked with multiple clients and frequently communicated with them. I wanted to understand why our current app and process impede our clients from submitting quality data.',
              },
              {
                type: 'gallery',
                images: [
                  { id: 'lh-pain-email1', src: '/images/projects/lighthouse-pain-email1.jpg', caption: 'Email chains for data requests' },
                  { id: 'lh-pain-email2', src: '/images/projects/lighthouse-pain-email2.jpg', caption: 'More email back-and-forth' },
                  { id: 'lh-pain-email3', src: '/images/projects/lighthouse-pain-email3.jpg', caption: 'Manual coordination' },
                  { id: 'lh-pain-excel', src: '/images/projects/lighthouse-pain-excel.jpg',  caption: 'Excel-based data exchange' },
                ],
              },
              {
                heading: 'Pain Point 1',
                body: "Our current tool is just a glorified FTP. Clients simply asked for white-glove service after they submitted files — they didn't participate in the data collection process at all. Our data strategists are spending too much time on client support instead of data modeling.",
              },
              {
                heading: 'Pain Point 2',
                body: "Our clients don't know what data we expect to receive.",
              },
              {
                heading: 'Pain Point 3',
                body: "Our clients don't know what is happening with their data when it is in data collection.",
              },
              {
                heading: 'Pain Point 4',
                body: 'Normally, we have a tight schedule — the process is very time sensitive.',
              },
              {
                level: 'h2',
                heading: 'Main Focuses',
                body: 'Before jumping to design, I decided to focus on three main points to ensure the design scope achieves a viable and consistent result. This new flow empowers clients to easily track their uploading progress, submit better data, and understand what is happening with their data when it is in the system.\n\n• Be Transparent — Let clients know which data they can upload or download, and whether data collection is in progress for each period.\n• Be Effective — Allow multiple file submissions at the same time with a clear structure to manage files and a fully streamlined flow.\n• Be Delightful — Keep the copy easy to understand and the visual style playful, making the cumbersome data collection process feel fun and approachable.',
                type: 'gallery',
                images: [
                  { id: 'lh-transparent', src: '/images/projects/lighthouse-transparent.png', caption: 'Be Transparent' },
                  { id: 'lh-effective',   src: '/images/projects/lighthouse-effective.png',   caption: 'Be Effective' },
                  { id: 'lh-delightful',  src: '/images/projects/lighthouse-delightful.png',  caption: 'Be Delightful' },
                ],
              },
              {
                level: 'h2',
                heading: 'Data Collection',
                body: "After equipping myself with user research, I was confident to start the design process. There are two phases in the uploading process: data collection and data validation.\n\nFirst, I designed user flows for the data collection phase. I organized the data files into a three-layer structure: dashboard, folders, and files/sheets. The user flow below illustrates how users upload files across these three layers.",
                type: 'image',
                id: 'lh-userflow',
                src: '/images/projects/lighthouse-userflow.png',
                caption: 'Data collection user flow — three-layer structure',
              },
              {
                body: "After having a holistic picture in mind, let's take a deep look into key design changes for the data collection phase.",
              },
              {
                level: 'h2',
                heading: 'Dashboard',
                type: 'video',
                src: 'https://player.vimeo.com/video/382720540?quality=2k&autoplay=1&loop=1&autopause=0&muted=1',
              },
              {
                type: 'comparison',
                before: { id: 'lh-dash-old', src: '/images/projects/lighthouse-dash-old.jpg', label: 'Before' },
                after:  { id: 'lh-dash-new', src: '/images/projects/lighthouse-dash-new.jpg', label: 'After' },
              },
              {
                body: "In the current design, it is very hard to keep track of the progress of the data collection. Users don't know which files they haven't uploaded in which folders, and there is only one progress bar at the top.\n\nKey changes: added a progress card reporting the current collection status; removed redundant date columns and added a status column; added a notification panel for recent changes and issues.",
              },
              {
                level: 'h2',
                heading: 'Upload Flow',
                type: 'video',
                src: 'https://player.vimeo.com/video/382820051?quality=2k&autoplay=1&loop=1&autopause=0&muted=1',
              },
              {
                type: 'comparison',
                before: { id: 'lh-upload-old', src: '/images/projects/lighthouse-upload-old.jpg', label: 'Before' },
                after:  { id: 'lh-upload-new', src: '/images/projects/lighthouse-upload-new.jpg', label: 'After' },
              },
              {
                body: 'The current uploading process is like FTP — users can only download previously uploaded files or upload new ones. The new design is a completely revamped guided flow involving metadata assignment. Users can upload multiple files; if a spreadsheet contains multiple sheets, they can choose which ones to include.\n\nKey changes: multi-file upload support; metadata assignment per file; real-time upload progress; ability to handle spreadsheet sheets individually.',
              },
              {
                level: 'h2',
                heading: 'Folder View',
                type: 'video',
                src: 'https://player.vimeo.com/video/382819989?quality=2k&autoplay=1&loop=1&autopause=0&muted=1',
              },
              {
                type: 'comparison',
                before: { id: 'lh-folder-old', src: '/images/projects/lighthouse-upload-old.jpg', label: 'Before' },
                after:  { id: 'lh-folder-new', src: '/images/projects/lighthouse-folder-new.jpg', label: 'After' },
              },
              {
                body: "Currently, there is no folder view — there is only one modal per folder that allows you to upload and download files. The new design includes a complete page for managing files, tracking upload status, and closing completed folders.\n\nKey changes: full folder page with file list; status indicators per file; ability to close completed folders; clear visual structure for multi-layer navigation.",
              },
              {
                level: 'h2',
                heading: 'Data Validation',
                body: 'The second phase of the uploading process is data validation.\n\nAfter users successfully upload all their data, they want to: validate it, explore it at any aggregation level to discover issues, quickly fix common issues by reuploading, track issue resolution progress, and reach out to data specialists when issues cannot be solved on their end.\n\nThe user flow below illustrates the general interactions between our data specialists and clients, and how the new flow streamlines communications and solves data issues faster.',
                type: 'image',
                id: 'lh-flow-validation',
                src: '/images/projects/lighthouse-flow-validation.jpg',
                caption: 'Data validation UX flow — client and data specialist interactions',
              },
              {
                body: "Let's take a deep look into key design changes for the data validation phase.",
              },
              {
                level: 'h2',
                heading: 'Data Validation Flow',
                type: 'video',
                src: 'https://player.vimeo.com/video/382820023?quality=2k&autoplay=1&loop=1&autopause=0&muted=1',
                body: 'In the new design, I introduced a new data validation flow after files have been uploaded. Users can quickly solve common data issues.\n\nUsers can check if the headers for the data spreadsheet are as expected — are there any missing headers or headers that have been assigned incorrectly? Users can also check if the data types are wrong, or if there are formatting errors.\n\nThen users can fix the data file by reuploading or send the file to our data specialist for help.',
              },
              {
                type: 'image',
                id: 'lh-flow-reupload',
                src: '/images/projects/lighthouse-flow-reupload.jpg',
                caption: 'Reupload flow after validation issues are detected',
              },
              {
                level: 'h2',
                heading: 'Validation Report Dashboard',
                type: 'video',
                src: 'https://player.vimeo.com/video/383185433?quality=2k&autoplay=1&loop=1&autopause=0&muted=1',
              },
              {
                type: 'comparison',
                before: { id: 'lh-val-old', src: '/images/projects/lighthouse-validation-old.jpg', label: 'Before' },
                after:  { id: 'lh-val-new', src: '/images/projects/lighthouse-validation-new.jpg', label: 'After' },
              },
              {
                body: "Validation reports are generated after data collection to help users explore data from any perspective, so as to find discrepancies and outliers. Users can start conversations with our data specialists about specific issues.\n\nCurrently, the reports dashboard does not help users track the status of resolving issues. Users need to click into each report to view up-to-date conversations.\n\nKey changes: added a scorecard showing pending conversations and reports needing review; added a status column per report; shows all conversations when clicking a report, with resolved ones hidden by default.",
              },
              {
                level: 'h2',
                heading: 'Conversations',
                type: 'video',
                src: 'https://player.vimeo.com/video/383194655?quality=2k&autoplay=1&loop=1&autopause=0&muted=1',
              },
              {
                type: 'comparison',
                before: { id: 'lh-conv-old', src: '/images/projects/lighthouse-conv-old.jpg', label: 'Before' },
                after:  { id: 'lh-conv-new', src: '/images/projects/lighthouse-conv-new.jpg', label: 'After' },
              },
              {
                body: "Currently, the comments dropdown overlaps the report — users can't review the report and write comments at the same time. The metrics panel on the left side also takes up too much horizontal space, preventing users from focusing on the report.\n\nKey changes: combined metrics panel and comments into one collapsible side panel; moved report left and panel right; easy to snapshot the report and share with data specialists.",
                type: 'image',
                id: 'lh-flow-conversation',
                src: '/images/projects/lighthouse-flow-conversation.jpg',
                caption: 'Conversation UX flow — snapshot and collaboration',
              },
              {
                level: 'h2',
                heading: 'Email Templates',
                body: 'Finally, in addition to all the design changes, I designed a set of email templates to help notify users about key moments in the data collection and validation process.\n\nThese emails serve as entry points for users to keep track of their progress. They help increase user engagement with the app and facilitate communications between clients and data specialists.',
              },
              {
                type: 'gallery',
                images: [
                  { id: 'lh-email1', src: '/images/projects/lighthouse-email1.jpg', caption: 'Reminder to sign off' },
                  { id: 'lh-email2', src: '/images/projects/lighthouse-email2.jpg', caption: 'Reminder for data collection' },
                  { id: 'lh-email3', src: '/images/projects/lighthouse-email3.jpg', caption: 'Reminder for sign-off on pending report' },
                  { id: 'lh-email4', src: '/images/projects/lighthouse-email4.jpg', caption: 'Reply in conversation' },
                ],
              },
              {
                level: 'h2',
                heading: 'Customer Journey',
                type: 'image',
                id: 'lh-journey',
                src: '/images/projects/lighthouse-journey.gif',
                caption: 'Full customer journey through the new Lighthouse experience',
              },
              {
                level: 'h2',
                heading: 'Outcome',
                body: "Unfortunately, with some key members leaving the team and shifting priorities in 2019, this project was put on hold — but the good news is it was rebooted by the end of 2019. The design system and interaction patterns established in this project carried forward into the rebuilt platform.",
              },
              {
                level: 'h2',
                heading: "What I've Learned",
                body: "It's important to set up design goals before diving into design and prototyping — this keeps design on track and helps make confident decisions during iterations.\n\nBeing transparent with users about their data, making processes effective, and finding moments of delight even in cumbersome enterprise workflows leads to a product people actually want to engage with.",
              },
            ],
          },
        },

        // ── Neustar Academy ───────────────────────────────────────────────────
        {
          id: 'project-neustar-academy',
          type: 'page',
          label: 'Neustar Academy',
          span: [1, 1],
          tone: 'muted',
          image: '/images/projects/neustar-academy.jpg',
          content: {
            type: 'project',
            heroImage: '/images/projects/neustar-academy-hero.jpg',
            tagline: 'A series of accessible e-learning courses that make complex marketing analytics approachable',
            year: '2018',
            role: 'Motion Graphic Designer, UX Designer, Video Editor',
            timeline: 'Nov 2018 – Present',
            team: '1 Design lead, 2 content strategists',
            tools: 'Sketch, Figma, Principle, After Effects, Premiere Pro, ScreenFlow',
            sections: [
              {
                level: 'h2',
                heading: 'What is Neustar Academy?',
                body: 'Marketing analytics requires extensive experience and knowledge. Despite intuitive UI design, internal teams and external clients struggle to interpret reports, create plans, and solve business questions using available tools.\n\nNeustar Academy was created as a series of accessible courses designed to make learning more engaging than traditional user guides — blending on-camera instruction, custom motion graphics, and interactive quizzes.',
              },
              {
                level: 'h2',
                heading: 'Courses Produced',
                body: 'Multi-Touch Attribution Essentials · Marketing Mix Modeling Essentials · Neustar Academy Creator Orientation',
              },
              {
                level: 'h2',
                heading: 'Design Goals',
                body: 'Produce high-quality courses with a unified visual language. Provide smooth learning experiences for both internal teams and external clients. Gather continuous feedback to improve course content over time.',
              },
              {
                level: 'h2',
                heading: 'On-Camera Shooting',
                body: 'Four MTA experts and seven MMM experts served as teachers and narrators, lending expertise, voices, and diversity to the courses. I managed all camera shooting and voice recording sessions.',
                type: 'gallery',
                images: [
                  { id: 'na-cam1', src: '/images/projects/na-camera-1.jpg', caption: 'On-camera recording session' },
                  { id: 'na-cam2', src: '/images/projects/na-camera-2.jpg', caption: 'Expert narration setup' },
                  { id: 'na-cam3', src: '/images/projects/na-camera-3.jpg', caption: 'Studio lighting and framing' },
                  { id: 'na-cam4', src: '/images/projects/na-camera-4.jpg', caption: 'Recording in progress' },
                ],
              },
              {
                level: 'h2',
                heading: 'Unified Motion Graphics',
                body: 'Initial mockups were created in Sketch, motion graphics elements developed in Adobe After Effects, and final assembly handled in ScreenFlow as a reusable video template. A dynamic, vibrant color scheme with fast transitions kept lessons energetic.',
                type: 'image',
                id: 'na-motion',
                src: '/images/projects/na-motion-template.png',
                caption: 'Motion graphics template system',
              },
              {
                level: 'h2',
                heading: 'Course Platform',
                body: 'Courses were assembled in TalentLMS, a cloud-hosted learning management system, organized into sections containing video tutorials and quizzes.',
                type: 'gallery',
                images: [
                  { id: 'na-ss1', src: '/images/projects/na-screenshots-1.png', caption: 'TalentLMS course view' },
                  { id: 'na-ss2', src: '/images/projects/na-screenshots-2.png', caption: 'Course navigation' },
                  { id: 'na-courses', src: '/images/projects/na-courses.png', caption: 'Course catalog' },
                ],
              },
              {
                level: 'h2',
                heading: 'Outcome and Impact',
                type: 'metrics',
                items: [
                  { value: '8',     label: 'Active courses' },
                  { value: '1413',  label: 'Active users' },
                  { value: '8751',  label: 'Course assignments' },
                  { value: '1106',  label: 'Completed courses' },
                ],
                body: 'Post-course surveys (276 MTA responses, 122 MMM responses) consistently highlighted the bite-sized format, real-world examples, and clear demonstrations as the most valuable elements.',
              },
              {
                level: 'h2',
                heading: 'Learner Feedback',
                type: 'gallery',
                carousel: true,
                aspectRatio: '4/3',
                images: [
                  { id: 'na-chart1', src: '/images/projects/na-chart-1.jpg', caption: 'Survey results — overall satisfaction' },
                  { id: 'na-chart2', src: '/images/projects/na-chart-2.jpg', caption: 'Survey results — content quality' },
                  { id: 'na-chart3', src: '/images/projects/na-chart-3.jpg', caption: 'Survey results — learning outcomes' },
                ],
              },
            ],
          },
        },

      ],
    },

    // ── Row 2 ──────────────────────────────────────────────────────────────────
    {
      id: 'about',
      type: 'page',
      label: 'About',
      span: [1, 1],
      tone: 'base',
      illustration: 'vectorly-UNI-paper-pen',
      content: {
        type: 'about',
        name: 'Chengchang Qian',
        role: 'Staff Product Designer',
        location: 'San Francisco Bay Area',
        resumeUrl: '/resume.pdf',
        bio: "I'm a Staff Product Designer focused on driving experience vision for AI-native products and complex platform ecosystems.\n\nWith over 10 years of experience across enterprise and consumer platforms, I specialize in systematic thinking, transforming fragmented systems into cohesive, scalable experiences that help people accomplish meaningful work.\n\nAt ServiceNow, I lead the design and vision for AI-native customer and partner experiences, establishing foundational UX architecture and scalable interaction patterns that enable AI-assisted workflows across the ecosystem.\n\nMy work focuses on defining product vision, UX frameworks, and system-level design patterns that help organizations translate emerging technologies into cohesive, real-world product experiences.",
        experience: [
          {
            id: 'exp-servicenow',
            company: 'ServiceNow',
            role: 'Staff Product Designer',
            period: 'May 2024 – Present',
            location: 'Santa Clara, CA · Hybrid',
            description: 'Led the design and vision for AI-native customer and partner experiences, establishing foundational UX architecture and scalable interaction patterns. Drove 0→1 design of MyNow — ServiceNow\'s personalized customer portal — and led Unified AI Search across the ServiceNow ecosystem.',
          },
          {
            id: 'exp-linkedin-senior',
            company: 'LinkedIn',
            role: 'Senior Product Designer',
            period: 'Sep 2021 – Apr 2024',
            location: 'Sunnyvale, CA',
            description: 'Led design and product vision for monetization (eCommerce, checkouts, global payments & billing), customer success, and admin experiences. Launched Account IQ — a GenAI B2B selling tool that drove $22.6M in new customer acquisition in 2 months with 86% CSAT, ramped to all Sales Navigator users.',
          },
          {
            id: 'exp-linkedin',
            company: 'LinkedIn',
            role: 'Product Designer',
            period: 'Jun 2020 – Oct 2021',
            location: 'Sunnyvale, CA',
            description: 'Led design of monetization, customer success, and administrative experiences across self-serve and field-assisted channels.',
          },
          {
            id: 'exp-neustar',
            company: 'Neustar',
            role: 'Senior UX Designer',
            period: 'Dec 2016 – Jun 2020',
            location: 'Greater Los Angeles Area',
            description: 'Led design of marketing measurement, attribution, and optimization solutions for Fortune 500 clients. Built and maintained the design system; shipped high-impact features including Scenario Listing and Custom Report Export.',
          },
          {
            id: 'exp-marketshare',
            company: 'Neustar MarketShare',
            role: 'UX Designer',
            period: 'Jun 2014 – Dec 2016',
            location: 'Los Angeles, CA',
            description: 'Led design of core products — Multi-Touch Attribution, Marketing Mix Modeling, and Dynamic Pricing. Contributed to client growth across MasterCard, Intel, USAA, CarMax, and Twitter, helping position MarketShare as a Forrester Wave leader.',
          },
          {
            id: 'exp-deepfield',
            company: 'Deepfield (Nokia)',
            role: 'UX Engineer',
            period: 'May 2013 – Aug 2013',
            location: 'Ann Arbor, MI',
            description: 'Designed, developed, and evaluated data visualizations for real-time network performance and security monitoring, deployed across 90% of U.S. cable infrastructure.',
          },
        ],
        education: [
          {
            school: 'University of Michigan',
            degree: 'MS, Human-Computer Interaction',
            period: '2012 – 2014',
          },
          {
            school: 'University of Science and Technology Beijing',
            degree: 'BS, Computer Science',
            period: '2008 – 2012',
          },
        ],
      },
    },
    {
      id: 'process',
      type: 'page',
      label: 'Process',
      span: [1, 1],
      tone: 'base',
      illustration: 'vectorly-UNI-note-todo-checklist',
      content: {
        type: 'process',
        steps: [
          { number: '01', label: 'Discover', body: 'User interviews, session analysis, competitive audit. I want to understand the real problem — and who actually has it — before touching Figma.' },
          { number: '02', label: 'Define',   body: 'Journey maps, problem framing, success metrics. Alignment with stakeholders before any solutions reach the screen.' },
          { number: '03', label: 'Design',   body: 'Rapid iteration from rough flows to high-fidelity. I prototype to test and persuade, not to document.' },
          { number: '04', label: 'Deliver',  body: "Handoff specs, design QA, and staying involved through launch. The work isn't done until real users are using it." },
        ],
      },
    },
    {
      id: 'craft',
      type: 'grid',
      label: 'Craft',
      span: [1, 1],
      tone: 'base',
      illustration: 'vectorly-UNI-palette-art-drawing',
      items: [
        {
          id: 'craft-motion',
          type: 'grid',
          label: 'Motion & Animation',
          span: [2, 2],
          tone: 'base',
          image: '/images/craft/motion-cover.gif',
          gallery: true,
          items: [
            { id: 'motion-planet',    type: 'page', label: 'Planet Animation',      span: [2,1], tone: 'image', image: '/images/craft/motion-4.gif',     content: { type: 'image', src: '/images/craft/motion-4.gif',     caption: 'Planet animation' } },
            { id: 'motion-alignment', type: 'page', label: 'Alignment Interaction', span: [1,1], tone: 'image', image: '/images/craft/motion-1.gif',     content: { type: 'image', src: '/images/craft/motion-1.gif',     caption: 'Alignment interaction' } },
            { id: 'motion-swiping',   type: 'page', label: 'Cards Swiping',         span: [1,1], tone: 'image', image: '/images/craft/motion-2.gif',     content: { type: 'image', src: '/images/craft/motion-2.gif',     caption: 'Cards swiping gesture' } },
            { id: 'motion-icons',     type: 'page', label: 'Icons Animation',       span: [1,1], tone: 'image', image: '/images/craft/motion-3.gif',     content: { type: 'image', src: '/images/craft/motion-3.gif',     caption: 'Icons animation' } },
            { id: 'motion-smoke',     type: 'page', label: 'Smoke Trail',           span: [1,1], tone: 'image', image: '/images/craft/motion-5.gif',     content: { type: 'image', src: '/images/craft/motion-5.gif',     caption: 'Smoke trail effect' } },
            { id: 'motion-city',      type: 'page', label: 'City Cards',            span: [2,1], tone: 'image', image: '/images/craft/motion-7.gif',     content: { type: 'image', src: '/images/craft/motion-7.gif',     caption: 'City cards animation' } },
            { id: 'motion-text',      type: 'page', label: 'Text Alignment',        span: [1,1], tone: 'image', image: '/images/craft/motion-6.gif',     content: { type: 'image', src: '/images/craft/motion-6.gif',     caption: 'Text alignment animation' } },
            { id: 'motion-3d',        type: 'page', label: '3D Text',               span: [1,1], tone: 'image', image: '/images/craft/motion-8.gif',     content: { type: 'image', src: '/images/craft/motion-8.gif',     caption: '3D text animation' } },
            { id: 'motion-clock',    type: 'page', label: 'Clock',            span: [1,1], tone: 'image', image: 'https://cdn.prod.website-files.com/5bb4f72aa4b9230c9185a00f/5d5c79d33f3dbbe4fa4e87f6_clock.gif',                          content: { type: 'image', src: 'https://cdn.prod.website-files.com/5bb4f72aa4b9230c9185a00f/5d5c79d33f3dbbe4fa4e87f6_clock.gif',                          caption: 'Clock animation' } },
            { id: 'motion-loader',   type: 'page', label: 'Loader',           span: [1,1], tone: 'image', image: 'https://cdn.prod.website-files.com/5bb4f72aa4b9230c9185a00f/5d5dd205349bb635a6ab58a9_loader.gif',                         content: { type: 'image', src: 'https://cdn.prod.website-files.com/5bb4f72aa4b9230c9185a00f/5d5dd205349bb635a6ab58a9_loader.gif',                         caption: 'Loader animation' } },
            { id: 'motion-bubble',   type: 'page', label: 'Bubble',           span: [1,1], tone: 'image', image: 'https://cdn.prod.website-files.com/5bb4f72aa4b9230c9185a00f/5d5ef2e2ffcccb5c8f94937e_Bubble.gif',                         content: { type: 'image', src: 'https://cdn.prod.website-files.com/5bb4f72aa4b9230c9185a00f/5d5ef2e2ffcccb5c8f94937e_Bubble.gif',                         caption: 'Bubble animation' } },
            { id: 'motion-stepped',  type: 'page', label: 'Stepped Animation',span: [2,1], tone: 'image', image: 'https://cdn.prod.website-files.com/5bb4f72aa4b9230c9185a00f/5d5c7bc4ccedcfbd49e88f03_Stepped%20Animation.gif',            content: { type: 'image', src: 'https://cdn.prod.website-files.com/5bb4f72aa4b9230c9185a00f/5d5c7bc4ccedcfbd49e88f03_Stepped%20Animation.gif',            caption: 'Stepped animation' } },
            { id: 'motion-beaker',   type: 'page', label: 'Beaker',           span: [1,1], tone: 'image', image: 'https://cdn.prod.website-files.com/5bb4f72aa4b9230c9185a00f/5d5c794fe0e87152a799380b_Beaker.gif',                         content: { type: 'image', src: 'https://cdn.prod.website-files.com/5bb4f72aa4b9230c9185a00f/5d5c794fe0e87152a799380b_Beaker.gif',                         caption: 'Beaker animation' } },
            { id: 'motion-splash',   type: 'page', label: 'Splash Animation', span: [2,1], tone: 'image', image: 'https://cdn.prod.website-files.com/5bb4f72aa4b9230c9185a00f/5d5c79b0ccedcf39ece88903_splash%20animation.gif',             content: { type: 'image', src: 'https://cdn.prod.website-files.com/5bb4f72aa4b9230c9185a00f/5d5c79b0ccedcf39ece88903_splash%20animation.gif',             caption: 'Splash animation' } },
            { id: 'motion-break',    type: 'page', label: 'Break Text',       span: [2,1], tone: 'image', image: 'https://cdn.prod.website-files.com/5bb4f72aa4b9230c9185a00f/5d5ef99887f780bba77068a7_Break%20Text.gif',                   content: { type: 'image', src: 'https://cdn.prod.website-files.com/5bb4f72aa4b9230c9185a00f/5d5ef99887f780bba77068a7_Break%20Text.gif',                   caption: 'Break text animation' } },
          ],
        },
        {
          id: 'craft-print',
          type: 'grid',
          label: 'Print & Visual',
          span: [2, 1],
          tone: 'elevated',
          image: '/images/craft/print-poster.jpg',
          gallery: true,
          items: [
            { id: 'print-poster',   type: 'page', label: 'Poster',              span: [2,1], tone: 'image', image: '/images/craft/print-poster.jpg',   content: { type: 'image', src: '/images/craft/print-poster.jpg',   caption: 'Poster' } },
            { id: 'print-bifold',   type: 'page', label: 'Bifold Design',       span: [1,1], tone: 'image', image: '/images/craft/print-bifold.jpg',   content: { type: 'image', src: '/images/craft/print-bifold.jpg',   caption: 'Bifold design' } },
            { id: 'print-brochure', type: 'page', label: 'Brochure',            span: [1,1], tone: 'image', image: '/images/craft/print-brochure.jpg', content: { type: 'image', src: '/images/craft/print-brochure.jpg', caption: 'Brochure' } },
            { id: 'print-signing',  type: 'page', label: 'Signing Wall',        span: [2,1], tone: 'image', image: '/images/craft/print-signing.jpg',  content: { type: 'image', src: '/images/craft/print-signing.jpg',  caption: 'Signing wall' } },
            { id: 'print-pantone',  type: 'page', label: 'Pantone Color Study', span: [1,1], tone: 'image', image: '/images/craft/print-pantone.jpg',  content: { type: 'image', src: '/images/craft/print-pantone.jpg',  caption: 'Pantone color project' } },
            { id: 'print-books',    type: 'page', label: 'House in the Book',   span: [1,1], tone: 'image', image: '/images/craft/print-books.jpg',    content: { type: 'image', src: '/images/craft/print-books.jpg',    caption: 'House in the Book' } },
            { id: 'illus-sunset',   type: 'page', label: 'Sunset Illustration', span: [2,1], tone: 'image', image: '/images/craft/illus-sunset.png',   content: { type: 'image', src: '/images/craft/illus-sunset.png',   caption: 'Sunset illustration' } },
            { id: 'illus-planet',   type: 'page', label: 'Planet Illustration', span: [1,1], tone: 'image', image: '/images/craft/illus-planet.png',   content: { type: 'image', src: '/images/craft/illus-planet.png',   caption: 'Planet illustration' } },
            { id: 'print-switch',   type: 'page', label: 'Switch',             span: [1,1], tone: 'image', image: 'https://cdn.prod.website-files.com/5bb4f72aa4b9230c9185a00f/5de6c5fddd14420218d97ab6_switch.png', content: { type: 'image', src: 'https://cdn.prod.website-files.com/5bb4f72aa4b9230c9185a00f/5de6c5fddd14420218d97ab6_switch.png', caption: 'Switch design' } },
          ],
        },
        {
          id: 'craft-dataviz',
          type: 'page',
          label: 'Data Visualization',
          span: [2, 1],
          tone: 'image',
          image: '/images/projects/dataviz-hero.jpg',
          content: {
            type: 'project',
            heroImage: '/images/projects/dataviz-hero.jpg',
            tagline: 'Data visualizations designed and built for marketing analytics, network intelligence, and public datasets',
            year: '2013–2016',
            role: 'UX designer & front-end developer',
            timeline: '2013 – 2016',
            team: 'Solo projects',
            tools: 'HTML / CSS, Javascript, D3.js, Angular, jQuery',
            sections: [
              {
                level: 'h2',
                heading: 'Multi-Touch Attribution Recommendations',
                body: 'I designed and developed two fully customized data visualizations in Neustar Multi-Touch Attribution product using D3.js and AngularJS.\n\nThe first time series diagram can help our users get an overview of how well their marketing plan go by comparing projected revenue with no changes in their marketing plan and potential revenue if they were to apply all recommended changes.\n\nThe donut chart and table below shows the breakdown of top recommendations by channel. Users can see projected (current) spend versus recommended spend, and the potential revenue lift for each area, if they were to apply the recommended spend.',
              },
              {
                type: 'video',
                src: 'https://player.vimeo.com/video/382824779?quality=2k&autoplay=1&loop=1&autopause=0&muted=1',
              },
              {
                level: 'h2',
                heading: "Oscar's Best Picture Nominees Analysis",
                body: "This project learns the characteristics and trends of Oscar Best-Picture movies.\n\nWe can find valuable insights from several tasks below:\n• Find how Oscar Best-Picture movies distribute in different genres.\n• Find which movie/genre is most profitable and popular.\n• Find the correlation among budget, gross, and rating.\n• Find the trend of movie rating, votes, gross, budget, and profit.",
                link: { url: 'http://sherlocq.github.io/oscar/', label: 'View Live Site' },
              },
              {
                type: 'video',
                src: 'https://player.vimeo.com/video/382824801?quality=2k&autoplay=1&loop=1&autopause=0&muted=1',
              },
              {
                level: 'h2',
                heading: 'Deepfield UX Engineer Intern',
                body: 'I worked as an UX Engineer intern at Deepfield (Ann Arbor, MI) during summer 2013, a great practical experience for quickly going through the design, development and evaluation cycle.\n\nMy job at Deepfield involves creating new data visualizations for the product and wrapping data visualizations into reusable and customizable UI components.',
              },
              {
                type: 'gallery',
                carousel: true,
                aspectRatio: '16/9',
                images: [
                  { id: 'dv-deepfield-1', src: '/images/craft/dv-deepfield-1.png', caption: 'Deepfield — network intelligence dashboard' },
                  { id: 'dv-deepfield-2', src: '/images/craft/dv-deepfield-2.png', caption: 'Deepfield — traffic analysis view' },
                  { id: 'dv-deepfield-3', src: '/images/craft/dv-deepfield-3.png', caption: 'Deepfield — anomaly detection' },
                  { id: 'dv-deepfield-4', src: '/images/craft/dv-deepfield-4.png', caption: 'Deepfield — flow visualization' },
                ],
              },
              {
                level: 'h2',
                heading: 'Crash Finder',
                body: 'Crash Finder is a data visualization that can help people explore civil aviation accidents and selected incidents within the United States from 1962 to present based on locations, date, and injury severity.\n\nThis visualization can inform users about the change of safety of aviation throughout time and help them make the decision for a safer flight trip.',
                link: { url: 'https://sherlocq.github.io/crashfinder/', label: 'View Live Site' },
              },
              {
                type: 'gallery',
                carousel: true,
                aspectRatio: '16/9',
                images: [
                  { id: 'dv-crash-1', src: '/images/craft/dv-crash-1.jpg', caption: 'Crash Finder — U.S. aviation accidents explorer' },
                  { id: 'dv-crash-2', src: '/images/craft/dv-crash-2.jpg', caption: 'Crash Finder — accident detail view' },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      id: 'contact',
      type: 'page',
      label: 'Contact',
      span: [1, 1],
      tone: 'base',
      illustration: 'vectorly-UNI-handshake',
      content: {
        type: 'contact',
        email: 'chengchangqian@gmail.com',
        linkedin: 'https://linkedin.com/in/chengchangqian/',
      },
    },
  ],
};

export function getNodeByPath(root, path) {
  let node = root;
  for (const id of path) {
    if (!node.items) return null;
    node = node.items.find((n) => n.id === id);
    if (!node) return null;
  }
  return node;
}

export function getBreadcrumbs(root, path) {
  const crumbs = [{ id: null, label: root.label }];
  let node = root;
  for (const id of path) {
    if (!node.items) break;
    node = node.items.find((n) => n.id === id);
    if (!node) break;
    crumbs.push({ id: node.id, label: node.label });
  }
  return crumbs;
}
