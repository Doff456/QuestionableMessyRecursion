
const fs = require('fs');
const path = require('path');
const yauzl = require('yauzl');

function extractZip(zipPath, extractPath = './extracted') {
    return new Promise((resolve, reject) => {
        // Verifica se o arquivo ZIP existe
        if (!fs.existsSync(zipPath)) {
            console.log(`Arquivo ${zipPath} não encontrado!`);
            return reject(new Error('Arquivo não encontrado'));
        }

        // Cria o diretório de extração se não existir
        if (!fs.existsSync(extractPath)) {
            fs.mkdirSync(extractPath, { recursive: true });
        }

        console.log(`Extraindo ${zipPath} para ${extractPath}...`);

        yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
            if (err) {
                console.error('Erro ao abrir o arquivo ZIP:', err.message);
                return reject(err);
            }

            const extractedFiles = [];

            zipfile.readEntry();
            zipfile.on('entry', (entry) => {
                const outputPath = path.join(extractPath, entry.fileName);

                if (/\/$/.test(entry.fileName)) {
                    // É um diretório
                    fs.mkdirSync(outputPath, { recursive: true });
                    zipfile.readEntry();
                } else {
                    // É um arquivo
                    const outputDir = path.dirname(outputPath);
                    fs.mkdirSync(outputDir, { recursive: true });

                    zipfile.openReadStream(entry, (err, readStream) => {
                        if (err) {
                            console.error('Erro ao ler entrada:', err.message);
                            return reject(err);
                        }

                        const writeStream = fs.createWriteStream(outputPath);
                        readStream.pipe(writeStream);

                        writeStream.on('close', () => {
                            extractedFiles.push(entry.fileName);
                            zipfile.readEntry();
                        });

                        writeStream.on('error', reject);
                    });
                }
            });

            zipfile.on('end', () => {
                console.log('Extração concluída com sucesso!');
                console.log('\nArquivos extraídos:');
                extractedFiles.forEach(file => {
                    console.log(`- ${file}`);
                });
                resolve(extractedFiles);
            });

            zipfile.on('error', reject);
        });
    });
}

// Exemplo de uso - descompacta o arquivo cdt-mobile-app.zip
async function main() {
    try {
        await extractZip('cdt-mobile-app.zip');
    } catch (error) {
        console.error('Erro ao extrair o arquivo:', error.message);
    }
}

main();

// Você também pode especificar um diretório de destino diferente:
// extractZip('cdt-mobile-app.zip', './minha-pasta');
