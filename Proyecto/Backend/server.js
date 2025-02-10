const express = require('express'); 
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

app.get('/api/test', (req, res) => {
  console.log("API called /api/test");
  res.send('¡Hola desde el backend!');
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
