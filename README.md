# Progetto Nest Todo List Test

## Descrizione
Per il progetto ho scelto come framework di sviluppo NESTJS come esercizio di stile ed opportunità per impararlo.

La scelta è stata guidata anche dal fatto che durante il colloquio intercorso con Lorenzo, mi aveva espresso la preferenza di vedere un'implementazione basata su NESTJS, visto che comunque avevo avuto modo di mostrargli  progetti da me sviluppati basati su EXPRESS puro, che è poi il framework di riferimento che ho usato maggiormente negli ultimi anni.

Lo store dei dati è basato su layer Sequelize e Mysql.

Sequelize perchè lo uso da anni e ha sempre soddisfatto le aspettative come flessibilità di utilizzo, semplicità di configurazione e gestione che come possibilità di tuning.

Mysql è un po il mio db preferito da anni per la semoplicità di installazione e configurazione. In oltre non mi ha mai deluso anche come performances sia su progetti piccoli che medi.

La configurazione dell'applicativo si basa sia su file di configurazione di cui si possono trovare degli esempi nel percorso di progetto


```bash
./src/config
```

Se il file conf viene omesso le stesse variabili possono essere specificate da environment.
In ambiente dockerizzato consiglio di montare un volume nel percorso di residenza dei file conf per poter modificare e personalizzare le configurazioni.

L'autenticazione e l'acccesso alle api viene gestita tramite autenicazione con token jwt.


## Api

Riferimenti e documentazione sulle api si possono trovare in formato json importabile su postman sotto il percorso di progetto 

```
./apidoc
```

oppure una volta fatto partire il progetto, si possono consultare tramite la funzionalità swagger al percorso 

```
http://localhost:3000/apidoc#/
```



## Installazione

```bash
$ npm install
```

## Lancio dell'app

```bash
# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# build 
$ npm run build

# pulisce l'installazione dei moduli node e li reinstalla da capo
$ npm run clean

# lancio con debug
$ npm run start:dev
```

## Test

```bash
# per lanciare il test delle api in locale 
$ npm run test:e2e

```


## Stay in touch

- Author - [Andrea Stambazzi](https://www.linkedin.com/in/andrea-stambazzi-a375214/)

