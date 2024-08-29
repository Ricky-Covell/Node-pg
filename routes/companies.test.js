// // // // // // GLOBAL // // // // // //
const request = require('supertest');

const app = require("../app");
const { createData } = require("../_test-common");
const db = require("../db");



// // // // // BEFORE & AFTER // // // // // 
beforeEach(createData);

afterAll(async () => {
    await db.end()
})


// // // // // // TESTS // // // // // //

// GET requests
describe('GET /', () => {
    test('Route responds with an array of companies', async () => {
        const res = await request(app).get('/companies');
        expect(res.body).toEqual({
            'companies': [
                {code: 'apple', name: 'Apple'},
                {code: 'ibm', name: 'IBM'},
            ]
        });
    })
});


describe('GET /apple', () => {
    test('Route responds with company info', async () => {
        const res = await equest(app).get('/companies/apple');
        expect(res.body).toEqual(
            {
                'company': {
                    code: 'apple',
                    name: 'Apple',
                    description: 'Maker of OSX.',
                    invoices: [1, 2],
                }
            }
        )
    })

    test("Route returns 404 if company not found", async () => {
        const res = await request(app).get("/companies/doesntexist");
        expect(res.status).toEqual(404);
      })
});

// POST requests
describe("POST /", () => {
    test("POST request should add company", async () => {
      const res = await request(app)
          .post("/companies")
          .send({name: "TacoTime", description: "Yum!"});
  
      expect(res.body).toEqual(
          {
            "company": {
              code: "tacotime",
              name: "TacoTime",
              description: "Yum!",
            }
          }
      )
    })
  
    test("POST request should return 500 if company already exists", async () => {
      const res = await request(app)
          .post("/companies")
          .send({name: "Apple", description: "Already exists"});
  
      expect(res.status).toEqual(500);
    })
  });


// PUT requests
describe("PUT /", () => {
  test("PUT request should update company info", async () => {
    const res = await request(app)
        .put("/companies/apple")
        .send({name: "AppleEdit", description: "Updated"});

    expect(res.body).toEqual(
        {
          "company": {
            code: "apple",
            name: "AppleEdit",
            description: "Updated",
          }
        }
    );
  });

  test("Returns 404 if company does not exist", async () => {
    const res = await request(app)
        .put("/companies/doesntexist")
        .send({name: "DoesntExist"});

    expect(res.status).toEqual(404);
  });

  test("Returns 500 if form is missing data", async () => {
    const res = await request(app)
        .put("/companies/apple")
        .send({});

    expect(res.status).toEqual(500);
  })
});
  
// DELETE requests
describe("DELETE /", () => {

  test("DELETE request removed company", async () => {
    const res = await request(app)
        .delete("/companies/apple");

    expect(res.body).toEqual({"status": "deleted"});
  });

  test("Returns 404 if company does not exist", async () => {
    const res = await request(app)
        .delete("/companies/DoesntExist");

    expect(res.status).toEqual(404);
  });
});
  