const {Client} = require('@elastic/elasticsearch');
const dotenv = require('dotenv');
dotenv.config();
const client = new Client({ node: process.env.ELASTIC_URL });
const  fs = require('fs');
const path = require('path');



fs.readdir('templates', (err, filenames ) => {
    if(err) {
       throw err;
    }
    filenames.forEach( (name)=>{

        fs.readFile(`templates/${name}`, 'utf-8', (err, content)=> {
            const templateName = path.parse(name).name;
            client.indices.putTemplate({
                name: templateName,
                body: JSON.parse(content)
            })
                .then((resp ) => {
                    console.log('Successfully put template', templateName, resp)
                })
                .catch( err => {
                    console.error(err, templateName, content);
                })
        })
    } )
});
