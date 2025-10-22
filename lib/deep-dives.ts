// FILE: lib/deep-dives.ts

export interface DeepDive {
  slug: string;
  title: string;
  question: string;
  premise: string;
  project: string;
  status: 'Coming Soon' | 'In Progress';
}

export const deepDives: DeepDive[] = [
  {
    slug: 'the-algorithms-ghost',
    title: "The Algorithm's Ghost",
    question: 'Can the foundational principles of modern mechanical engineering be expressed using the rhetorical, procedural logic of their originator, al-Khwarizmi?',
    premise: 'The word "algorithm" comes from the name of the 9th-century Persian mathematician, Muhammad ibn Musa al-Khwarizmi. His texts, written in prose, described step-by-step procedures for solving equations. Modern engineering is built on symbolic math, a language he wouldn\'t recognize. What is lost, or gained, in this translation from rhetorical procedure to abstract symbol?',
    project: 'Create a "Symbolic Translator" in Python. This program will take a simple, modern engineering equation (e.g., stress = force/area) and output a step-by-step solution in the prose style of al-Khwarizmi\'s texts. The tangible result is the working code and a short paper analyzing how this "ancient" representation changes the cognitive approach to problem-solving.',
    status: 'Coming Soon',
  },
  {
    slug: 'the-city-as-a-lung',
    title: 'The City as a Lung',
    question: 'Can the architectural logic of 19th-century sanitarians, who fought an imaginary foe, inform modern strategies for mitigating real airborne threats?',
    premise: 'The Miasma Theory—the belief that "bad air" caused disease—was wrong, but it wasn\'t stupid. It led to profound changes in urban design, like wider streets and better sanitation, because people intuitively understood that airflow mattered. Today, we face a new miasma of airborne pollutants.',
    project: 'Using computational fluid dynamics (CFD) software, create a 3D model of a generic city block. Simulate the flow and concentration of airborne particulates (our modern miasma). Then, redesign the block based on Miasma Theory principles—increasing airflow, creating open spaces—and run the simulation again. The tangible result is a comparative visual analysis and a paper titled "Learning from Wrong Ideas: A Miasma-Based Model for Healthier Urban Airflows."',
    status: 'Coming Soon',
  },
  {
    slug: 'the-grammar-of-the-desert',
    title: 'The Grammar of the Desert',
    question: 'Can the water-harvesting strategies of desert flora be abstracted into a formal "shape grammar" for designing hyper-efficient materials?',
    premise: 'The plants of the Kyzylkum Desert are masters of fluid dynamics, their surfaces covered in micro-textures evolved to capture every possible drop of moisture from the air. This isn\'t random; it\'s a physical language of survival written on the surface of a leaf.',
    project: 'Research and document the surface textures of 3-5 plants native to Karakalpakstan. Develop a computational shape grammar—a set of rules for combining simple geometric forms—that can procedurally generate these textures. The tangible result is the software tool and a design portfolio of novel, bio-inspired surfaces for passive water condensation, all generated from your grammar.',
    status: 'Coming Soon',
  },
  {
    slug: 'the-antikythera-calculation',
    title: 'The Antikythera Calculation',
    question: 'What is the "computational efficiency" of the Antikythera Mechanism when analyzed through the lens of modern mechanical design theory?',
    premise: 'The Antikythera Mechanism, an ancient Greek analog computer, used a breathtakingly complex system of gears to predict astronomical events. It was a physical embodiment of mathematical theory. Modern engineers often see gears as simple components, but here they formed a language.',
    project: 'Create a complete, functional, and animated 3D CAD model of the mechanism based on the latest research. Go beyond just modeling it. Write an accompanying engineering analysis of its gear trains, calculating transmission ratios, mechanical advantage, potential points of wear, and the propagation of error through the system. The tangible result is the CAD portfolio and your analytical paper.',
    status: 'Coming Soon',
  },
  {
    slug: 'the-cognitive-fingerprint-of-design',
    title: 'The Cognitive Fingerprint of Design',
    question: 'Can the cognitive process of a single engineer, working on a complex problem, be mapped and analyzed to reveal underlying patterns, biases, and moments of insight?',
    premise: 'We have models for how engineers should design, but the actual mental process is messy, chaotic, and full of false starts. The path to a solution is as unique as a fingerprint.',
    project: 'A "protocol analysis" of one: yourself. Choose a challenging, open-ended design problem. For two months, meticulously document your entire process: every sketch, every calculation, every Google search, every moment of frustration and every "aha moment." Create a coding system for your activities. The tangible result is a deeply reflective paper that maps your personal cognitive journey and compares it to established models of the design process from cognitive science.',
    status: 'Coming Soon',
  },
  {
    slug: 'ai-for-cognitive-de-biasing',
    title: 'AI for Cognitive De-biasing',
    question: 'Can an AI assistant help mitigate cognitive biases in the engineering design process?',
    premise: 'Engineers, like all humans, are prone to cognitive biases (e.g., confirmation bias, functional fixedness).',
    project: 'Design and write the pseudo-code for an AI assistant that analyzes an engineer\'s design log. The AI\'s goal is not to suggest solutions, but to detect patterns indicative of cognitive bias and ask targeted questions to prompt the human to think differently.',
    status: 'Coming Soon',
  },
  {
    slug: 'the-logic-of-a-lost-craft',
    title: 'The Logic of a Lost Craft',
    question: 'Can the procedural knowledge of an endangered craft be preserved not just as a video, but as a formal engineering grammar?',
    premise: 'Traditional crafts are dying out. These aren\'t just hobbies; they are complex systems of mechanical knowledge passed down through generations. The making of a simple sieve or a wooden boat involves hundreds of micro-decisions based on an intuitive understanding of materials and forces. This is a form of non-verbal engineering.',
    project: 'Choose a specific, well-documented craft from your region. Deconstruct the process into a series of fundamental steps and rules. Create a "shape grammar" in code—a symbolic system that can procedurally generate valid designs for that craft. The tangible result is a paper defining this grammar and a script that can output novel, "grammatically correct" designs that the original artisan would recognize as valid.',
    status: 'Coming Soon',
  },
];

// ADD THIS FUNCTION
export function getDeepDives(): DeepDive[] {
  return deepDives;
}

export function getDeepDiveBySlug(slug: string): DeepDive | null {
  return deepDives.find(dive => dive.slug === slug) || null;
}