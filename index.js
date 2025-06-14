
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function extractZip(zipPath, extractPath = './extracted') {
    try {
        // Verifica se o arquivo ZIP existe
        if (!fs.existsSync(zipPath)) {
            console.log(`Arquivo ${zipPath} não encontrado!`);
            return;
        }

        // Cria o diretório de extração se não existir
        if (!fs.existsSync(extractPath)) {
            fs.mkdirSync(extractPath, { recursive: true });
        }

        // Usa o comando unzip do sistema
        console.log(`Extraindo ${zipPath} para ${extractPath}...`);
        execSync(`unzip -o "${zipPath}" -d "${extractPath}"`, { stdio: 'inherit' });
        
        console.log('Extração concluída com sucesso!');
        
        // Lista os arquivos extraídos
        const files = fs.readdirSync(extractPath);
        console.log('\nArquivos extraídos:');
        files.forEach(file => {
            console.log(`- ${file}`);
        });
        
    } catch (error) {
        console.error('Erro ao extrair o arquivo:', error.message);
    }
}

// Exemplo de uso - descompacta o arquivo cdt-mobile-app.zip
extractZip('cdt-mobile-app.zip');

// Você também pode especificar um diretório de destino diferente:
// extractZip('cdt-mobile-app.zip', './minha-pasta');
