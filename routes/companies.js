const express = require('express');
const ExpressError = require('../expressError');
const db = require('../db');

let router = new express.Router();


// // // // // // // // COMPANY ROUTES // // // // // // // // 
router.get('/', async (req, res, next) => {
    try {
        const query = await db.query(
            `SELECT code, name
             FROM companies
             ORDER BY name`
        );

        return res.json({ 'companies': query.rows })
    }

    catch(error) {
        return next(error)
    }
});




router.get('/:code', async (req, res, next) => {
    try {
        let code = req.params.code;

        const companyQuery = await db.query(
            `SELECT code, name, description
             FROM companies
             WHERE code = $1`,
             [code]
        );

        const invoicesQuery = await db.query(
            `SELECT id
             FROM invoices
             WHERE comp_code = 1$`, 
             [code]
        );

        if (companyQuery.rows.length === 0) {
            throw new ExpressError(`Company Code:${code} Not Found`, 404);
        }

        const company = companyQuery.rows[0];
        const invoices = invoicesQuery.rows;

        company.invoices = invoices.map((invoice) => invoice.id);
        return res.json({ 'company': company });
    }

    catch(err){
        return next(err);
    }
})




router.post('/', async (req, res, next) => {
    try{
        let { code, description, name } = req.body;

        const result = await db.query(
            `INSERT INTO companies (code, description, name)
             VALUES (1$, 2$, $3)
             RETURNING code, description, name`,
             [code, description, name]
        )

        return res.status(201).json({ 'company': result.rows[0] });
    }

    catch(err){
        return next(err);
    }
});




router.put("/:code", async (req, res, next) => {
    try {
      let {description, name} = req.body;
      let code = req.params.code;
  
      const update = await db.query(
            `UPDATE companies
             SET name=$1, description=$2
             WHERE code = $3
             RETURNING code, name, description`,
             [code, description, name]
        );
  
      if (update.rows.length === 0) {
            throw new ExpressError(`Company Code:${code} Not Found`, 404)
      } else {
            return res.json({"company": update.rows[0]});
      }
    }
  
    catch (err) {
        return next(err);
    }
  });


  router.delete("/:code", async function (req, res, next) {
    try {
      let code = req.params.code;
  
      const deleteQuery = await db.query(
            `DELETE FROM companies
             WHERE code=$1
             RETURNING code`,
             [code]
        );
  
      if (deleteQuery.rows.length == 0) {
            throw new ExpressError(`Company Code:${code} Not Found`, 404)
      } else {
            return res.json({"status": "Deleted Successfully"});
      }
    }
    catch (err) {
        return next(err);
    }
  });
  
  
  module.exports = router;


  