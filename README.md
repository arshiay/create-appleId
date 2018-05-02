首先需要下载selenium jar包   https://goo.gl/Lyo36k

然后启动selenium服务器 java -jar selenium-xxxxx.jar

然后下载chromedriver    https://chromedriver.storage.googleapis.com/2.27/chromedriver_mac64.zip

然后npm install 该项目需要的依赖package

然后node apple-signup.js -Dwebdriver.chrome.driver=[下载解压的chromedriver路径]即可运行脚本。注意将要使用的chromdedriver文件拷贝一份命名为chromedriver。
node --harmony-async-await apple-signup2.js -Dwebdriver.chrome.driver=chromedriver        (注意使用nodev7以上版本)

**server 与 chromeDriver 必须启动在同意目录下**
