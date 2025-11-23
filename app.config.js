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
    name: "SkillMap",
    slug: "SkillMap",
    version: appVersion,
    orientation: "portrait",
    icon: "./assets/skillmap-logo.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/skillmap-logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/skillmap-logo.png",
        backgroundColor: "#ffffff"
      },
      package: "com.fiap.skillmap" // Nome do pacote Android
    },
    web: {
      favicon: "./assets/skillmap-logo.png"
    },
    
    extra: {
      appVersion: appVersion,
      commitHash: commitHash,
      eas: {
        projectId: "a2d196b8-81b2-4f43-99ef-d22f5a718929"
      }
    }
  }
};