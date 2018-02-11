var imagemin = require("imagemin"),    // The imagemin module.
    webp = require("imagemin-webp"),   // imagemin's WebP plugin.
    outputFolder = "./img",            // Output folder
    PNGImages = "./img/*.png",         // PNG images
    JPEGImages = "./img/*.jpg";        // JPEG images
    outputFolder = "../src/optimized_media";
    VocalImagesJpg = "../src/assets/*.jpg";
    VocalImagesPng = "../src/assets/*.png";
    VocalMainPng = "../../assets/*.png";

imagemin([VocalImagesPng, VocalMainPng], outputFolder, {
    plugins: [webp({
        lossless: true // Losslessly encode images
    })]
});

imagemin([VocalImagesJpg], outputFolder, {
    plugins: [webp({
        quality: 65 // Quality setting from 0 to 100
    })]
});