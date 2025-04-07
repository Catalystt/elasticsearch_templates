
const syncrequest = require('sync-request');
const dotenv = require('dotenv');
dotenv.config();
const url = process.env.ELASTIC_URL;
const  fs = require('fs');
const path = require('path');

fs.readdir('templates', (err, filenames ) => {
    if(err) {
       throw err;
    }
    filenames.forEach( (name)=>{
        fs.readFile(`templates/${name}`, 'utf-8', (err, content)=> {
           const formName = path.parse(name).name;
            try {
                    const deleteResp = syncrequest(
                        'DELETE',
                        `${url}/${formName}`,
                    );
        
                    const createResp = syncrequest(
                        'PUT',
                        `${url}/${formName}`,
                    );
                    console.log('done', formName);
            }
            catch (e) {
                console.error(e);
            }
        })
    } )
});

