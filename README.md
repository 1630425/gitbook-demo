# 1630425.github.io
<pre>
cd ~/Documents
npm install hexo-cli -g
hexo init blog
cd blog
npm i hexo-generator-json-content --save && npm i --save hexo-wordcount && git clone https://github.com/fi3ework/hexo-theme-archer.git themes/archer --depth=1
npm install
hexo server

修改主配置文件 _config.yml
更改主题名称
theme: archer

hexo server


生成密匙
ssh-keygen -t rsa -C "1630425@qq.com"
添加密钥到 ssh-agent
eval "$(ssh-agent -s)"
添加生成的SSH key到ssh-agent
ssh-add ~/.ssh/id_rsa

vim /Users/xzy/.ssh/id_rsa.pub
添加到github-设置-SSH and GPG keys-SSH keys


npm install hexo-deployer-git --save  // 文章部署到 git 的模块(将编译后的静态文件上传到github)
（下面为选择安装）
npm install hexo-generator-feed --save  // 建立 RSS 订阅
npm install hexo-generator-sitemap --save // 建立站点地图


上传 （重新本地生成并上传）
hexo g -d



博客主题更新和发布博客
更换主题后需要执行清缓存操作,网页正常情况下可以忽略此条命令：
hexo clean

生成静态网页
hexo g

开启本地预览服务
hexo s

发布线上
hexo d


说明：
hexo s(完整命令为hexo server)
hexo d(hexo deploy)

以下是命令的简写：
hexo n == hexo new
hexo g == hexo generate
hexo s == hexo server
hexo d == hexo deploy


自定义执行命令：
在package.json中添加 npm 脚本
scripts指定了运行脚本命令的npm命令行缩写，比如start指定了运行npm run s或npm start时，所要执行的命令。
"scripts": {
    "s": "echo Custom command... && hexo clean && hexo g && hexo s",
    "d": "echo Custom command... && hexo clean && hexo g -d"
  }

</pre>

<pre>
更换电脑
cd ~ && npm install hexo-cli -g(如何电脑上安装过无需在安装)
git clone https://gitee.com/codeserver/1630425.github.io.git
cd 1630425.github.io/
npm i hexo-generator-json-content --save && npm i --save hexo-wordcount && git clone https://github.com/fi3ework/hexo-theme-archer.git themes/archer --depth=1
npm install
hexo clean   // 清除缓存 网页正常情况下可以忽略此条命令
hexo g       // 生成静态网页
hexo s
</pre>


自动备份功能:<br>
npm install --save shelljs<br>
根目录的scripts文件夹下新建一个js文件，文件名随意取例如：auto-bak.js,如果没有scripts目录，请新建一个。

注意:<br>
自动备份功能在执行hexo s/hexo deploy 需在1630425.github.io/scripts/auto-bak.js文件中先设置项目路径(git clone到本地的路径)否则会报错

其他：<br>
[自动备份Hexo博客源文件](https://anson2416.github.io/posts/c4d910e6/)(qq邮箱备份)

[hexo常用命令笔记](https://segmentfault.com/a/1190000002632530)

hexo发布带图片博客<br>
1.修改hexo博客项目根目录_config.yml配置文件post_asset_folder项为true。<br>
2.hexo new “hexo发布带图片博客”<br>
3.在source/_post文件夹里面就会出现一个“hexo发布带图片博客.md”的文件和一个“hexo发布带图片博客”的文件夹。<br>
4.引用图片：
![avatar](data:;base64,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)

其他：
<pre>
自动部署
https://www.jianshu.com/p/d31595c48e4a
https://www.jianshu.com/p/f3fcecfc0be5?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation
https://www.jianshu.com/p/b232d8f26ac1?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation
</pre>

hexo生成永久链接
https://blog.csdn.net/lewky_liu/article/details/80517635
<pre>
Hexo的永久链接的默认格式是 :year/:month/:day/:title/，比如访问站点下某一篇文章时，其路径是 2018/04/12/xxxx/，如果我们的文章标题是中文的，那么该路径就会出现中文字符。在路径中出现了中文字符很容易引发各种问题，而且也不利于seo，因为路径包含了年月日三个层级，层级太深不利于百度蜘蛛抓取。

解决办法就是利用其它的插件来生成唯一的路径，这样就算我们的文件标题随意修改，而不会导致原本的链接失效而造成站点下存在大量的死链。 
安装插件
在站点根目录使用 git bash 执行命令：

npm install hexo-abbrlink --save

修改站点配置文件
打开根目录下的 _config.yml 文件，修改如下配置：

\# permalink: :year/:month/:day/:title/
\# permalink_defaults:
permalink: posts/:abbrlink.html
abbrlink:
  alg: crc32  # 算法：crc16(default) and crc32
  rep: hex    # 进制：dec(default) and hex
  
这里将页面都添加了 .html 的后缀，用来伪装成静态页面(虽说Hexo的页面本身就是静态页面)，这样可以直接从路径就知道这是个静态页面，方便seo。

接下来重新部署三连，可以看到我们的文章路径变成了 /posts/xxxxx.html，接下来就算我们将文字标题命名为中文也没问题了
</pre>

修改网站标志
同样，我们在index.html找到这行代码
我们可以发现，网页的图标被命名为favicon.ico
修改路径（通常图标的格式为ico，如果你的图片为png格式或jpg格式，我们可以到这个在线转换格式的网站把图片转换为ico格式 http://tool.lu/favicon/）

github官方主题
浏览器https://hexo.io/themes/进入github官方主题界面