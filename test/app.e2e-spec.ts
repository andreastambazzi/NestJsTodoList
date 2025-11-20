import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/modules/AppModule';
import { INestApplication } from '@nestjs/common';

const request = require('supertest');

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken : string = "";

  
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  
  afterAll(async () => {
    await app.close();
  });

  

  it('/GET /info dovrebbe restituire status 200 e il JSON corretto', () => {    
    return request(app.getHttpServer())
      .get('/info') 
      .expect(200) 
      .expect({ 
        info: 'Nest js test project',
      });
  });



  it('POST /auth/registerUser registra un utente di prova', async () => {    
    const response = await request(app.getHttpServer())
      .post('/auth/registerUser')
      .send({ 
        "username": "UtenteDiProva",
        "password": "ApritiSesamo123!",
        "firstname": "Utente",
        "lastname": "DiProva",
        "email": "utente.diprova@gmail.com"
      })
      .expect(200); 
        
    let data = response.body.data;
    
    expect(data).toBeDefined();
    expect(data.id).toBeDefined();    
    expect(typeof data.id).toBe('number');

  });


  it('POST /login dovrebbe autenticare l\'utente e restituire un token', async () => {    
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ 
        username: 'UtenteDiProva',
        password: 'ApritiSesamo123!'
      })
      .expect(201); 
        
    authToken = response.body.authToken;    
    expect(authToken).toBeDefined();
    expect(typeof authToken).toBe('string');

  });



  it('POST /user/getUserProfile dovrebbe recuperare il profilo dell\'utente logato', async () => {    
    const response = await request(app.getHttpServer())
      .get('/user/getUserProfile')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ 
        username: 'user',
        password: 'ApritiSesamo1!'
      })
      .expect(200); 
        
    let data = response.body.data;
    
    expect(data).toBeDefined();
    expect(data.id).toBeDefined();    
    expect(typeof data.id).toBe('number');

  });



  it('POST /user/deleteUserProfile dovrebbe rimuovere il profilo dell\'utente logato', async () => {    
    await request(app.getHttpServer())
      .delete('/user/deleteUserProfile')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect({
        "result": "ok",
        "data": true
      });                 

  });





});