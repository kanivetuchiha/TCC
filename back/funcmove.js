import { arrayMoveImmutable, arrayMoveMutable } from 'array-move';
import dados from './dados.json' assert { type: 'json' };


const arr = dados.bois

const newArr = arrayMoveImmutable(arr, 2,5)

console.log(newArr)