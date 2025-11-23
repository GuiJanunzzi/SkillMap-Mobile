import axios from "axios";

// IMPORTANTE: Ajuste o IP conforme o seu ambiente
// Emulador Android (Padrão): 'http://10.0.2.2:8080'
// Emulador Android Físico: Use o IP da sua máquina na rede (ex: 'http://192.168.1.15:8080')
// iPhone Físico ou Emulador iOS: Use o IP da sua máquina na rede (ex: 'http://192.168.1.15:8080')

const api = axios.create({
  baseURL: "https://skillmap-javabackend.onrender.com",
  timeout: 10000,
});

export default api;
