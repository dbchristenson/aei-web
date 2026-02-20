I will define them in this conversation so you can help me iteratively develop a design document to give to Claude code.


# Define your goal and audience
 This website is essentially a B2B or business-to-investor page. The nature of the company is currently an oil and gas exploration outfit which acquires blocks from the Indonesian government to then develop exploration wells on by connecting different entities (major O&G operators like ENI or state organizations/enterprises) to achieve this. AEI puts in some of its own money to retain an ownership share of the development and then can either sell their piece or hold it to wait for production to begin and start generating revenue. We are also currently in talks about expanding to geothermal project development.

 The goal is to communicate to this audience the experience, care, integrity, and most importantly the personal financial investment that AEI makes into its projects such that investors come onboard.


# List all the pages/sections you need
The current website is very barren and only has the minimum amount of information. It contains:

## Home Page
Home page with logo, full name of the company—PT Agra Energi Indonesia, nav bar, one line description of what the company does: "PT Agra Energi Indonesia, a privately held company, focused on high impact oil and gas exploration in Indonesia and some images, and 2 quotes which are important to the founder. All the visuals here need to be improved upon greatly, from the images used to the layout of the website itself. I am thinking of something along the lines of this wind energy development company's website: https://sonauraenergy.com/

## Company/About Page
"Company" page which is actually just an about page but the only thing on it is a "History" section giving a very concise description: "PT Agra Energi Indonesia is a privately held company, established in 2015, focused on high impact oil and gas exploration in Indonesia. PT Agra Energi Indonesia’s management team has over 100 years of experience in Indonesia and has a proven and extensive track record in the Indonesian oil and gas industry with British Gas, ARCO, UNOCAL, SANTOS and Black Gold Energy. Commercial experience raising capital for Black Gold Energy whose investors included Goldman Sachs and Temasek." What is good about this is that we get a list of important companies who have been stakeholders in the past which adds authority to the company's profile. I want to pull these companies out and display their logos in a nice carousel or floating space, something like that.

## Corporate Governance
This is just a navbar element and does not actually have a central page. It drops down to 4 different policies: "anti-corruption", "code of conduct", "communications", "drugs & alcohol". I think the presentation of these policies may be necessary for conducting business in Indonesia but I am honestly not sure. I think they are something that we can make less visible.

## Contact Page
Finally there is a contact page, which is often not a page on its own in websites now-a-days but it offers a phone number, email, and registered address for the business.

## Extra Features I Want to Implement
Now for the fun part is what sorts of features I want to add. I want to note that not all these features might be its own URL but they are important components.

### Geographical Visualization
The most important one I want to add is a map component which visualizes the blocks of area that AEI has had its hands in. There is this website (https://acunmedya.com/en/home) which has a very cool wireframe 3D globe feature. I want to emulate this feature and make some tweaks to it. First off we do not need the whole globe because we only operate in Indonesia, therefore we can restrict the map area to Southeast Asia (some arbitrary boundary). But if we do that we can't use a globe. So my idea is instead just like a "curve" with boundary restrictions so you still get the 3D pop without having to utilize the entire globe. The feature should have some zoom features and the blocks should be interactive such that when you move your cursor over it, it is highlighted and some information about the block is displayed. The setup would be two column with the info display on the left and the map visual on the right with some overlap where the map visual bleeds into the first column organically.

### Meet the team page
I want to add a page with pictures and bios of each of the most major team members in the company. Light animations could be used here like a carousel, pop out cards when moused over, etc. The specific features can come later but keep in mind this addition.

### Market Research
Another feature I want to introduce is some important numbers and statistics about domain that the business is in. This would be things like energy, current demand trends, decarbonization, security and reliability and things like that. I am currently in an MS Energy and Sustainability program so I can create the story but I need a place to put it and some way that supports it which we can design later. I also think having this would be a good way to introduce geothermal development to the company and show investors that we understand the position that SEA is in in regards to power generation.

# Wireframe

# Visual Style
## Imagery
I am planning to provide my own imagery from local photographers and what not, but the imagery I want to use revolves around nature to try to balance out the reality of what the company is doing which is exploration in nature. For the home page I am planning to use an image or short video of the ocean. For geothermal plays I would also like to share some images and videos of volcanos and their surrounding geology.

## Styling
I am really interested in the current trend of liquid/frosted glass components on top of spectacular nature backgrounds. The frost of the glass helps improve readability and offers endless options for animations and cool features I think. When this style is applicable is for components which are overlaid on videos or images like a logo, modal, or card.

Another thing I really like is Apple's dynamic backgrounds that they released a while ago. Its like a short animation of a beatiful nature destination, a birds eye view of the top of redwoods for example. So I am interested in incorporating those elements into the website.

## Font
I want to use Sans-Serif fonts for most all text on the website. We would use Serif fonts for important things like the Logo or to draw attention to something.

### Logo Serif Font
Lora

### Content Header Sans-Serif Font
Rubik

### Content Sans-Serif Font
Manrope

## Color Palette
Accessibility is very important because the founder of the company is really color-blind. Because of this, the chosen primary color for the company is blue. We also make lots of deepwater plays so the blue ties in well. I have designed some CSS for the color palette so here are the primary decoration colors for the web page: /* CSS HEX */
--bright-teal-blue: #067bc2ff;
--sky-reflection: #84bcdaff;
--bright-amber: #ecc30bff;
--coral-glow: #f37748ff;
--jet-black: #162521ff;

/* CSS HSL */
--bright-teal-blue: hsla(203, 94%, 39%, 1);
--sky-reflection: hsla(201, 54%, 69%, 1);
--bright-amber: hsla(49, 91%, 48%, 1);
--coral-glow: hsla(16, 88%, 62%, 1);
--jet-black: hsla(164, 25%, 12%, 1);

/* SCSS HEX */
$bright-teal-blue: #067bc2ff;
$sky-reflection: #84bcdaff;
$bright-amber: #ecc30bff;
$coral-glow: #f37748ff;
$jet-black: #162521ff;

/* SCSS HSL */
$bright-teal-blue: hsla(203, 94%, 39%, 1);
$sky-reflection: hsla(201, 54%, 69%, 1);
$bright-amber: hsla(49, 91%, 48%, 1);
$coral-glow: hsla(16, 88%, 62%, 1);
$jet-black: hsla(164, 25%, 12%, 1);

/* SCSS RGB */
$bright-teal-blue: rgba(6, 123, 194, 1);
$sky-reflection: rgba(132, 188, 218, 1);
$bright-amber: rgba(236, 195, 11, 1);
$coral-glow: rgba(243, 119, 72, 1);
$jet-black: rgba(22, 37, 33, 1);

/* SCSS Gradient */
$gradient-top: linear-gradient(0deg, #067bc2ff, #84bcdaff, #ecc30bff, #f37748ff, #162521ff);
$gradient-right: linear-gradient(90deg, #067bc2ff, #84bcdaff, #ecc30bff, #f37748ff, #162521ff);
$gradient-bottom: linear-gradient(180deg, #067bc2ff, #84bcdaff, #ecc30bff, #f37748ff, #162521ff);
$gradient-left: linear-gradient(270deg, #067bc2ff, #84bcdaff, #ecc30bff, #f37748ff, #162521ff);
$gradient-top-right: linear-gradient(45deg, #067bc2ff, #84bcdaff, #ecc30bff, #f37748ff, #162521ff);
$gradient-bottom-right: linear-gradient(135deg, #067bc2ff, #84bcdaff, #ecc30bff, #f37748ff, #162521ff);
$gradient-top-left: linear-gradient(225deg, #067bc2ff, #84bcdaff, #ecc30bff, #f37748ff, #162521ff);
$gradient-bottom-left: linear-gradient(315deg, #067bc2ff, #84bcdaff, #ecc30bff, #f37748ff, #162521ff);
$gradient-radial: radial-gradient(#067bc2ff, #84bcdaff, #ecc30bff, #f37748ff, #162521ff);

# Wireframe
See attached image file for layout of home page. I want to focus on this page because it is the first thing investors see, the rest can be engineered and styled later—but a good foundation is important to me.