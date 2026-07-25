export const COMPANY = {
  name: 'Lotus Agritech',
  fullName: 'Lotus Agritech PVC Manufacturing Company',
  slogan: "Building trust and steady flows, one pipe at a time.",
  phone: '+91 90990 90582',
  phoneDisplay: '+91 90990 90582',
  phoneHref: 'tel:+919099090582',
  whatsappHref: 'https://wa.me/919099090582',
  email: 'sales@lotusagritech.com',
  instagram: 'https://www.instagram.com/lotusagritech_dwarka/',
  address:
    'Dwarka - Jamnagar Highway, Opposite Khodiyar Mandir, Juvanpur - Kalyanpur - Dwarka, India - 361315',
  addressShort: 'Dwarka - Jamnagar Highway, Juvanpur, Dwarka, Gujarat',
  hours: 'Open 24×7 — Full Time',
  mapQuery:
    'Khodiyar Mandir, Juvanpur, Kalyanpur, Dwarka, Gujarat 361315',
  developerCredit: "Developed by Deep's Technology",
  founded: '2010',
};

export const COLORS = {
  primary: '#0B5ED7',
  primaryDark: '#094AAD',
  secondary: '#1E293B',
  accent: '#F97316',
  bg: '#FFFFFF',
  text: '#1F2937',
};

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Products', to: '/products' },
  { label: 'Industries', to: '/industries' },
  {
    label: 'Company',
    children: [
      { label: 'Infrastructure', to: '/infrastructure' },
      { label: 'Manufacturing Process', to: '/manufacturing-process' },
      { label: 'Quality Control', to: '/quality-control' },
      { label: 'Gallery', to: '/gallery' },
      { label: 'Certificates', to: '/certificates' },
    ],
  },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

export const FOOTER_LINKS = {
  company: [
    { label: 'About Us', to: '/about' },
    { label: 'Infrastructure', to: '/infrastructure' },
    { label: 'Manufacturing Process', to: '/manufacturing-process' },
    { label: 'Quality Control', to: '/quality-control' },
    { label: 'Careers', to: '/careers' },
  ],
  quick: [
    { label: 'Products', to: '/products' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Certificates', to: '/certificates' },
    { label: 'Blog', to: '/blog' },
    { label: 'FAQ', to: '/faq' },
  ],
  support: [
    { label: 'Contact Us', to: '/contact' },
    { label: 'Request a Quote', to: '/request-quote' },
    { label: 'Download Brochure', to: '/download-brochure' },
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms & Conditions', to: '/terms' },
  ],
};

export const INDUSTRIES = [
  {
    title: 'Agriculture & Irrigation',
    description:
      'Reliable PVC & UPVC piping networks for farm irrigation, borewells, and drip systems.',
    icon: 'GiWheat',
  },
  {
    title: 'Residential Plumbing',
    description:
      'Lightweight, corrosion-free pipes for domestic water supply and drainage.',
    icon: 'FaHome',
  },
  {
    title: 'Construction & Infrastructure',
    description:
      'Durable pipe solutions engineered for housing, commercial and infrastructure projects.',
    icon: 'FaBuilding',
  },
  {
    title: 'Industrial Applications',
    description:
      'Heavy-duty pipes built to withstand demanding industrial fluid transport needs.',
    icon: 'FaIndustry',
  },
  {
    title: 'Municipal & Sewage',
    description:
      'High-strength drainage and sewage pipe systems for municipal networks.',
    icon: 'FaCity',
  },
  {
    title: 'Electrical Conduits',
    description:
      'Safe, insulated conduit piping for electrical wiring protection.',
    icon: 'FaBolt',
  },
];

export const MANUFACTURING_STEPS = [
  {
    step: '01',
    title: 'Raw Material Selection',
    description:
      'Premium virgin PVC & UPVC resin is sourced and tested for purity before production.',
  },
  {
    step: '02',
    title: 'Extrusion Process',
    description:
      'Resin is melted and extruded through precision dies on high-speed extrusion lines.',
  },
  {
    step: '03',
    title: 'Cooling & Sizing',
    description:
      'Pipes pass through calibrated cooling tanks to achieve exact diameter and roundness.',
  },
  {
    step: '04',
    title: 'Quality Testing',
    description:
      'Every batch undergoes pressure, impact and dimensional testing in our QA lab.',
  },
  {
    step: '05',
    title: 'Packaging',
    description:
      'Pipes are bundled, labeled and packed securely to prevent transit damage.',
  },
  {
    step: '06',
    title: 'Dispatch',
    description:
      'Timely dispatch through our logistics network to dealers and job sites nationwide.',
  },
];

export const WHY_CHOOSE_US = [
  {
    title: 'Premium Quality',
    description: 'ISO-certified manufacturing with lead-free, virgin-grade material.',
    icon: 'FaMedal',
  },
  {
    title: 'Advanced Infrastructure',
    description: 'State-of-the-art extrusion lines with automated quality checks.',
    icon: 'FaCogs',
  },
  {
    title: 'Pan-India Delivery',
    description: 'Robust logistics network ensuring on-time delivery across regions.',
    icon: 'FaTruck',
  },
  {
    title: '24×7 Support',
    description: 'Round-the-clock customer support and technical assistance.',
    icon: 'FaHeadset',
  },
];

export const FAQS = [
  {
    question: 'What types of pipes does Lotus Agritech manufacture?',
    answer:
      'We manufacture a wide range of PVC and UPVC pipes for agriculture, plumbing, drainage, industrial and electrical conduit applications, available in various diameters and pressure ratings.',
  },
  {
    question: 'Are your pipes ISI / ISO certified?',
    answer:
      'Yes, our pipes are manufactured under strict quality standards and are backed by ISO 9001:2015 certification along with lead-free compliance for potable water applications.',
  },
  {
    question: 'Do you offer bulk / dealer pricing?',
    answer:
      'Yes, we offer competitive bulk and dealership pricing. Please use our Request a Quote form or call us directly to discuss your requirements.',
  },
  {
    question: 'What is the typical delivery time?',
    answer:
      'Delivery timelines vary based on order quantity and location, typically ranging from 3-10 business days. Our team will confirm exact timelines upon order confirmation.',
  },
  {
    question: 'Can I get a custom pipe specification manufactured?',
    answer:
      'Yes, we accommodate custom diameter, length, and pressure rating requirements for bulk orders. Contact our sales team for feasibility and pricing.',
  },
  {
    question: 'How can I apply for a job at Lotus Agritech?',
    answer:
      'Visit our Careers page to view current openings and submit your application online with your resume.',
  },
];

export const API_BASE_URL = '/api';
