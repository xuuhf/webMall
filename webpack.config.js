const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devServerPort = 8000; // 开发服务器端口号

// 是否是开发环境
// process.env拿到的是一个对象，它的属性可以通过命令行参数传入
// 这个NODE_ENV就是从package.json的dev/build scripts传进来的
const isDev = process.env.NODE_ENV === 'development';

const config = {
    // 指定webpack的模式，然后一些第三方库（比如vue、react等）也会针对这个值采用不同的包
    // 像vue就有完整版、运行时版等。参考：https://vuejs.org/v2/guide/deployment.html#With-Build-Tools
    mode: isDev ? "development" : "production",
    entry: path.join(__dirname, 'src/main.js'), // 项目总入口js文件
    // 输出文件
    output: {
        path: path.join(__dirname, 'dist'),
        /**
         * hash跟chunkhash的区别，如果entry有多个，或者需要单独打包类库到
         * 一个js文件的时候，hash是所有打包出来的每个js文件都是同样的哈希，
         * 而chunkhash就是只是那个chunk的哈希，也就是chunkhash如果那个chunk
         * 没有变化就不会变，而hash只要某一个文件内容有变化都是不一样的，所以
         * 用chunkhash区分开每一个文件有变化时才更新，让浏览器起到缓存的作用
         */
        filename: isDev ? 'bundle.[hash:8].js' : '[name].[chunkhash:8].js',
    },
    module: {
        rules: [{
                // 使用vue-loader解析.vue文件
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        // 当文件大小小于limit byte时会把图片转换为base64编码的dataurl，否则返回普通的图片
                        limit: 8192,
                        name: 'dist/assest/images/[name]-[hash:5].[ext]' // 图片文件名称加上内容哈希
                    }
                }]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/, // 不处理这两个文件夹里的内容
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(), // 最新版的vue-loader需要配置插件
        new HtmlWebpackPlugin({
            filename: 'index.html', // 生成的文件名称
            template: 'index.html', // 指定用index.html做模版
            inject: 'body' // 指定插入的<script>标签在body底部
        }),
        new CleanWebpackPlugin(['dist'])
    ],
    /**
     * 添加可以自动解析的扩展
     * 就是 import 的时候可以不用写后缀也能正确引用文件了
     * eg：添加了'.vue'，import App from './app.vue' 可以写成 import App from './app' 了
     * 参考：https://webpack.docschina.org/configuration/resolve/#resolve-extensions
     */
    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json', '.vue']
    }
};

// 如果是开发环境
if (isDev) {
    config.module.rules.push({
        test: /\.css$/,
        use: [
            // 要加上style-loader才能正确解析.vue文件里的<style>标签内容
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1
                }
            },
            'postcss-loader'
        ]
    }, {
        test: /\.scss$/,
        use: [
            // 处理顺序是从sass-loader到style-loader
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                }
            },
            'sass-loader'
        ]
    });

    // 指定开发环境启动的服务器的信息
    config.devServer = {
        // contentBase: path.join(__dirname, 'dist'),
        port: devServerPort,
        host: '0.0.0.0', // 配置成0.0.0.0的话通过ip，localhost都能访问
        overlay: {
            errors: true // 如果有编译错误的话直接显示到页面上
        },
        hot: true // 开启模块热替换【https://webpack.docschina.org/guides/hot-module-replacement】
    };
    config.plugins.push(
        new Webpack.HotModuleReplacementPlugin() // 模块热替换插件
    );

    // 生成source map，方便调试
    // https://webpack.docschina.org/configuration/devtool/#src/components/Sidebar/Sidebar.jsx
    config.devtool = 'cheap-eval-source-map';
} else { // 生产环境

    // 把css分离打包到单独的文件
    config.module.rules.push({
        test: /\.css$/,
        use: [
            MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1
                }
            },
            'postcss-loader'
        ]
    }, {
        test: /\.scss$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                }
            },
            'sass-loader'
        ]
    });
    config.plugins.push(
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "style.[hash:8].css",
            chunkFilename: "[id].[hash:8].css"
        })
    );

    // 单独打包第三方类库文件（比如vue框架）
    config.optimization = {
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        },
        runtimeChunk: {
            name: entrypoint => `runtimechunk~${entrypoint.name}`
        }
    };
}

module.exports = config;