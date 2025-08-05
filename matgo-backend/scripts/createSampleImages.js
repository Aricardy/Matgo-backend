import fs from 'fs';
import path from 'path';

const createSampleImages = () => {
  console.log('Creating sample image placeholders...');

  // Create directories
  const dirs = [
    'public/images/avatars',
    'public/images/buses', 
    'public/images/saccos'
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });

  // Sample SVG placeholder content
  const createSVGPlaceholder = (text, width = 200, height = 200, bgColor = '#e0e0e0') => {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#666" text-anchor="middle" dy=".3em">${text}</text>
</svg>`;
  };

  // Create passenger avatars
  const passengers = ['laurine', 'Ariam', 'Allan', 'Alice', 'Ariamkim', 'Kim'];
  passengers.forEach(name => {
    const filePath = `public/images/avatars/${name}.jpg`;
    if (!fs.existsSync(filePath)) {
      const svgContent = createSVGPlaceholder(name, 150, 150, '#f0f0f0');
      fs.writeFileSync(filePath.replace('.jpg', '.svg'), svgContent);
      console.log(`Created placeholder: ${filePath.replace('.jpg', '.svg')}`);
    }
  });

  // Create sacco logos
  const saccos = ['NTVRS', 'Super Metro', 'Expresso', 'Embasava'];
  saccos.forEach(sacco => {
    const filePath = `public/images/saccos/${sacco}.png`;
    if (!fs.existsSync(filePath)) {
      const svgContent = createSVGPlaceholder(sacco, 200, 100, '#4a90e2');
      fs.writeFileSync(filePath.replace('.png', '.svg'), svgContent);
      console.log(`Created placeholder: ${filePath.replace('.png', '.svg')}`);
    }
  });

  // Create bus images
  const buses = [
    // NTVRS buses
    'X-Rated', 'Phenomenal', 'CyberPunk', 'Harukaze', 'Ikigai', 'Mellows',
    'Stormzy', 'Monalisa', 'Spice', 'Spurs', 'Explicit', 'SCrilla',
    
    // Expresso buses
    'Baba Yaga', 'Moxie', 'Ferari', 'Detroit', 'Gamer', 'Funka Delica', 'Malkia', 'Jabari',
    
    // Embasava buses
    'Brawlout', 'MoneyFest', 'Heartless', 'Matrix', 'Mood', 'Genesis', 'Restoration',
    
    // SuperMetro buses
    'fleet 1456', 'fleet 3743', 'fleet 8643', 'fleet 3737', 'fleet 1234', 'fleet 0001',
    'fleet 19373', 'fleet 12349', 'fleet 23456', 'fleet 32456', 'fleet 78902'
  ];

  buses.forEach(bus => {
    const filePath = `public/images/buses/${bus}.jpg`;
    if (!fs.existsSync(filePath)) {
      const svgContent = createSVGPlaceholder(bus, 300, 200, '#ff6b6b');
      fs.writeFileSync(filePath.replace('.jpg', '.svg'), svgContent);
      console.log(`Created placeholder: ${filePath.replace('.jpg', '.svg')}`);
    }
  });

  // Create driver and conductor avatars (sample names)
  const driversConductors = [
    'Ochila', 'Theo', 'Dan', 'Deni', 'Steven', 'Ivor', 'Brian', 'Matt',
    'Otieno', 'Tman', 'Dante', 'Ellie', 'Alex', 'Renee', 'Dave', 'Nachi',
    'Benjamin', 'JVB', 'Martin', 'Slim', 'John', 'Maverick', 'Roy', 'Drakoo',
    'Allan', 'Ben', 'Jeff', 'Kim', 'Moses', 'Mwari', 'Andrew', 'Mwas',
    'Davi', 'Kibe', 'Smith', 'Abra', 'Hypr', 'Capi', 'Badder', 'Ostoo',
    'Qodo', 'Huan', 'Gemmi', 'Evans', 'Kilo', 'Lenny', 'Mkuu', 'Jade',
    'Kelvin', 'Resto', 'Maina', 'Steve', 'Charles', 'Ryan', 'Nahbeel',
    'James', 'Adri', 'Soshi'
  ];

  driversConductors.forEach(name => {
    const filePath = `public/images/avatars/${name}.jpg`;
    if (!fs.existsSync(filePath)) {
      const svgContent = createSVGPlaceholder(name, 150, 150, '#95e1d3');
      fs.writeFileSync(filePath.replace('.jpg', '.svg'), svgContent);
      console.log(`Created placeholder: ${filePath.replace('.jpg', '.svg')}`);
    }
  });

  console.log('Sample image placeholders created successfully!');
  console.log('\nNote: These are SVG placeholders. Replace with actual images as needed.');
  console.log('Image directories:');
  console.log('- public/images/avatars/ (user profile pictures)');
  console.log('- public/images/buses/ (bus/matatu images)');
  console.log('- public/images/saccos/ (sacco company logos)');
};

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createSampleImages();
}

export default createSampleImages;