const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 64, 192, 512];
const inputFile = path.join(__dirname, '..', 'src', 'logo.svg');
const outputDir = path.join(__dirname, '..', 'public');

async function generateIcons() {
  try {
    // Gerar PNGs para todos os tamanhos
    for (const size of sizes) {
      const pngBuffer = await sharp(inputFile)
        .resize(size, size)
        .png()
        .toBuffer();
      
      fs.writeFileSync(path.join(outputDir, `logo${size}.png`), pngBuffer);
      
      // Usar o logo32.png como favicon.ico temporariamente
      if (size === 32) {
        fs.copyFileSync(
          path.join(outputDir, 'logo32.png'),
          path.join(outputDir, 'favicon.ico')
        );
      }
    }

    console.log('Ícones gerados com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar ícones:', error);
  }
}

generateIcons(); 