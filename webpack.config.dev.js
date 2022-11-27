//ya solo ejecutando webpack tiene una configuracion predeterminada pero aqui somos mas especificos con lo que queremos
const path = require('path');//path ya esta en node por defecto asi que no hay que descargar ningun npm

//esto agrega el plugin de html al proyecto
const HtmlWebpackPlugin = require('html-webpack-plugin')

//importamos el plugin de css 
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//importamos el plugin de copiar archivos
const CopyPlugin = require('copy-webpack-plugin');

//importamos el paquete de las variables de entorno
const Dotenv = require('dotenv-webpack');

module.exports={//esto es un objeto de node

  entry:'./src/index.js',//esto dice cual es el elemnto de entrada de la app o punto dentrada el elmento inicial

  output:{//lo que va a enviar el webpack

    path:path.resolve(__dirname,'dist'),//esto nos dice donde se encuentra nuestro projecto para usarlo para que no importa donde este posicionado siempre sepa donde esta el projecto, el que tiene que saber donde esta el projecto es donde subamos este mismo,dist es el estandar para el nombre del path

    filename: '[name].[contenthash].js',//podemos ponerle nombre a el archivo js que compile webpack y un hash para que cada vez que hagamos un cambio la pagina tenga una cache diferente
    assetModuleFilename: 'assets/images/[hash][ext][query]'//esto es para el nombre de las imagenes
  },

  //especificamos que el modo es en desarrollo cambiamos el script de package json dev le ponemos que use de configuracion este archivo
  mode:'development',

  //ponemos watch true para que copile automaticamente lo nuevo esto lo que hace es que si ejecutamos dev se quede esperando porn cambios en el proyecto y webpack los valla copilando a medida que los creamos esto se puede quitar haciendo un script watch, para salir de que copile automaticamente el la termina ctrl + c
	watch: true,

  resolve:{//estos son los tipos de archivos que va a usat el projecto

    extensions:['.js'],//el arreglo de las extensiones si trabajaramos con react o svelte pondriamos jsx
    alias: {//le ponemos ul alias a las url de las cosas que mas usemos terminar con / las rutas, donde usemos estas url en el codigo podemos cambiarlo por los alias
      '@utils': path.resolve(__dirname, 'src/utils/'),//utilidades
      '@templates': path.resolve(__dirname, 'src/templates/'),//tempates
      '@styles': path.resolve(__dirname, 'src/styles/'),//estilos
      '@images': path.resolve(__dirname, 'src/assets/images/'),//imagenes
    }
  },

  module: {//configuraciones de modulos

    rules: [//las reglas es un arreglo

      {//lleva un objeto dentro
        
        // Test declara que extensión de archivos aplicara el loader
        test: /\.m?js$/,//todas las extensione que empiesen por m osea los modulos y tengan js

        // Use es un arreglo u objeto donde dices que loader aplicaras
        use: {

          loader: "babel-loader"

        },

        // Exclude permite omitir archivos o carpetas especificas
        exclude: /node_modules/
        /*todo esto es para aplicar babel cuando ejecutemos el webpack*/
      },

      //agregamos otra regla para css
      {
        test:/\.css|.styl$/i,//importante escribir el template bien
        use:[MiniCssExtractPlugin.loader,'css-loader','stylus-loader'],
      },

      //agragamos una regla que ta viene con webpack para hacer las imagenes variables que busque las imagenes de una fuente
      {
        test: /\.png/,
        type: 'asset/resource'
      },
      //creamos una regla para que esto funciones tenemos que quitar la importacion de fuentes del proyecto y configurar la fuente que descargamos en el main.css
      {
        //para trabajar con extensiones woff
        test: /\.(woff|woff2)$/,
        //para trabajar con el loader url
        use: {
          loader: "url-loader",
          //las configuraciones del loader
          options: {
            // limit => limite de tamaño
            limit: 10000,
            // Mimetype => tipo de dato
            mimetype: "application/font-woff",
            // name => nombre de salida y le colocamos un hash
            name: "[name].[contenthash].[ext]",
            // outputPath => donde se va a guardar en la carpeta final
            outputPath: "./assets/fonts/",
            publicPath: "../assets/fonts/",//importante poner la ruta bien dependiendo donde este el main.css
            esModule:false,
          }
        }
      }
    ]
  },

  //añadimos plugins a nuestra configuracion
  plugins:[//plugins con minuscula importante

    //agregamos HtmlWebpackPlugin al proyecto
    new HtmlWebpackPlugin({
      
      inject:'body',//ponemos inject true para que haga la insersion de los elementos INYECTA EL BUNDLE AL TEMPLATE HTML

      template: './public/index.html', // LA RUTA AL TEMPLATE HTML
      
      filename: './index.html' // NOMBRE FINAL DEL ARCHIVO el TEMPLATE se transforma en el filename
    }),

    new MiniCssExtractPlugin({
      filename: 'assets/[name].[contenthash].css'//lo configuramos con uba carpeta donde lo va a guardar y un hash
    }),//agrego otro plugin para css

    new CopyPlugin({//agregamos otro plugin, para copiar

      patterns: [//agramos un patterns que lleva un arreglo

        {//y el arreglo un objeto

          from: path.resolve(__dirname, "src", "assets/images"),//desde la carpeta de las imagens y para eso hacemos igual que los modulos arriba cuando creamos la carpeta dist

          to: "assets/images"//y la envie a una carpeta que creamos en dist , donde pongamos las url de las imagenes en el proyecto tenemos que poner esta direccion para que al final la carpeta dist pueda funcionar sin errores
        }
      ]
    }),
    new Dotenv()//utilizamos el plugin de las variables de entorno que podemos usarsarla en el codigo del projecto se configuran en .env example process.env.API; asi podemos poner en el codigo datos que puedan ser sensibles asi no los pueden leer cuando este subida
  ],
}