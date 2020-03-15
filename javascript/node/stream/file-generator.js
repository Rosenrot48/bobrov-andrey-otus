// Создаем файл в этой же директории

// максимальый размер файла
const MAX_SIZE = 105000000;
// Разделитель для записи в файл
const  DIVIDER = '\n';

const fs = require('fs');
const file = fs.createWriteStream('./num.file');
// node --max-old-space-size=8192 file-generator.js
// node --max-old-space-size=10400 file-generator.js
// генерит рандомное число, которое в последствии запишем в файл
const  getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};
// 105000000 52500000 26250000

while (file.writableLength < MAX_SIZE) {
    file.write(getRandomInt(1,1000).toString() + DIVIDER);
}
const size = file.writableLength;
file.end( () => {
    console.log('Файл создан. \nРазмер файла: ' + size)
});
