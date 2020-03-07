const fs = require('fs');
const readStream = fs.createReadStream('/your_file', {encoding: 'utf-8'});

// Преобразуем строку в массив чисел
const transformDataToInt = async (string) =>{
    return string.split('\n').map(value => {
        return parseInt(value);
    }).filter(value => !isNaN(value));
};

 // берет данные из блока прочитанных данных из потока
 async function* reader() {
     for await (const chunk of readStream) {
         yield await transformDataToInt(chunk);
     }
 }
//  главная функция, которая вызывается и дергает данные из прочитанных блоков
const func = async () => {
    let result = [];
     for await (const $ of reader()) {
         const between = mergeSort($);
         if (!(result.indexOf(between[0]) > -1)) {
             result.push(between[0])
         }
     }
    return  mergeSort(result);
};
//  функция склеивания двух массивов в порядке возрастания
const merge = (leftArr, rightArr) => {
    const sortedArr = [];
    while (leftArr.length && rightArr.length) {
        if (leftArr[0] <= rightArr[0]) {
            sortedArr.push(leftArr[0]);
            leftArr = leftArr.slice(1)
        } else {
            sortedArr.push(rightArr[0]);
            rightArr = rightArr.slice(1)
        }
    }
    while (leftArr.length)
        sortedArr.push(leftArr.shift());
    while (rightArr.length)
        sortedArr.push(rightArr.shift());
    return sortedArr;
};
// функция разбития массива на подмассивы
function mergeSort(arr) {
    if (arr.length < 2) {
        return arr;
    } else {
        const midpoint = Math.floor(arr.length / 2);
        const leftArr = arr.slice(0, midpoint);
        const rightArr = arr.slice(midpoint, arr.length);
        return merge(mergeSort(leftArr), mergeSort(rightArr));
    }
}
 func().then(result => {
     console.log('This should be the sorted array for the whole file!');
     console.log(result);
      // Если будет желание записать выходной массив в файл
      /*const outputFile = fs.createWriteStream('./result.txt');
      outputFile.write(result.toString());
      outputFile.end(() => {
          console.log('Result of sorted was written on file  - result.txt')
      });*/
 });
