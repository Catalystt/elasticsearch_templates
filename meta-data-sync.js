
const _ = require("lodash");

const fs = require('fs');

const {Client} = require('@elastic/elasticsearch');
const dotenv = require('dotenv');
dotenv.config();
const client = new Client({node: process.env.ELASTIC_URL});

var mysql = require('mysql2/promise');


const execute = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: 'dashboard'
        });
        let [metadata, _] = await connection.execute("select m.`id`,m.key, m.value, m.description, m.type, m.orgId, m.uid from meta_data m");



        await Promise.all(metadata.map(async (m) => {

            let [metastores, _] = await connection.execute("select `key`, `value` from meta_data_store where `meta_id` =  ?", [m.id]);

            let metaObj = {...m, store: metastores};
            resp = await client.update({
                id: m.id,
                index: 'metadata',
                body: {"doc": metaObj, "doc_as_upsert": true},
                type: 'default',
            });

            console.log(resp);
        }));
        console.log('closing connection');
        connection.end();
    } catch (e) {
        console.error(e);
    }


};

execute();
