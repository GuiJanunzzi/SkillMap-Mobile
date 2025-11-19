const { execSync } = require("child_process");
const myPackage = require("./package.json");

let commitHash;
try {
  // Tenta pegar o hash curto do último commit
  commitHash = execSync("git rev-parse --short HEAD").toString().trim();
} catch (e) {
  console.warn('Não foi possível pegar o hash do commit (Git não iniciado?), usando "Dev"');
  commitHash = "Dev";
}

const appVersion = myPackage.version; // Pega a versão do package.json (ex: 1.0.0)

module.exports = {
  expo: {
    name: "skillmap-mobile",
    slug: "skillmap-mobile",
    version: appVersion,
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.fiap.skillmap" // Nome do pacote Android
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    
    extra: {
      appVersion: appVersion,
      commitHash: commitHash,
    }
  }
};