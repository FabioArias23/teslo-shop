import {v4 as uuid} from 'uuid'
//funcion de flecha y llamamos la request directamente de express de manera global en nest 
export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
    
//Aca evaluamos 
    //console.log(file)

    if(!file) return callback( new Error('File is empty'), false)

    const fileExtension = file.mimetype.split('/')[1];
    
    const fileName = `${uuid()} .${fileExtension}`

    callback(null,fileName);
// 

}