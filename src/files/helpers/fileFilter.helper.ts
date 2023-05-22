//funcion de flecha y llamamos la request directamente de express de manera global en nest 
export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
    
//Aca evaluamos 
    //console.log(file)

    if(!file) return callback( new Error('File is empty'), false)
// esto es para aceptar o no un archivo
    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg','png','gif','jpeg'];
    
    if( validExtensions.includes( fileExtension)){
        return callback( null, true)
    }

    callback(null,false);
// 

}