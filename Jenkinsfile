pipeline {
    agent none
    environment {
        DING_DING_ROBOT = "https://oapi.dingtalk.com/robot/send?access_token=be574bc14245c7bee1557ca511bfd000d2e6970ef1ce1f0655315205de3f1ff1"
    }
    stages {
        stage ('打包') {
            agent {
                docker 'kkarczmarczyk/node-yarn:latest'
            }
            steps {
                sh 'yarn config set phantomjs_cdnurl https://npm.taobao.org/mirrors/phantomjs/'
                sh 'yarn config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/'
                sh 'yarn config set registry https://registry.npm.taobao.org'
                sh 'yarn config set chromedriver_cdnurl https://npm.taobao.org/mirrors/chromedriver'
                sh 'yarn install'
                sh 'yarn run build'
            }
        }
        stage ('发布Dev环境Docker镜像 ') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    docker.withRegistry('https://registry-vpc.cn-hangzhou.aliyuncs.com'){
                        sh "docker login --username=47406310@qq.com --password=agilesoho@2018  registry-vpc.cn-hangzhou.aliyuncs.com"
                        docker.build('registry-vpc.cn-hangzhou.aliyuncs.com/thinkmacro/tm-merchant-admin.dev').push('latest')
                        if(currentBuild.currentResult!= "SUCCESS") {
                          sh "curl ${env.DING_DING_ROBOT} -H 'Content-Type: application/json' -X POST -d '{\"msgtype\": \"text\", \"text\": { \"content\": \"构建项目及分支: ${env.JOB_NAME} \n状态: 发布Dev Docker镜像失败 \"}}'"
                        }
                    }
                }
            }
        }
        stage ('部署到Dev环境') {
            steps {
                script {
                    docker.withRegistry('https://registry-vpc.cn-hangzhou.aliyuncs.com'){
                        sh "docker run --rm -i -e CATTLE_URL=http://116.62.220.99:30001 \
                        -e CATTLE_ACCESS_KEY=853B574D027C057323B9 \
                        -e CATTLE_SECRET_KEY=sYg1BD8fjUiws6jp3fZbhRhpMmyYHnmrxYnXbUf9 \
                        etlweather/gaucho upgrade 1s61 \
                        --imageUuid=docker:registry-vpc.cn-hangzhou.aliyuncs.com/thinkmacro/tm-merchant-admin.dev:latest \
                        --start_first=false \
                        --auto_complete=true"
                        if(currentBuild.currentResult!= "SUCCESS") {
                          sh "curl ${env.DING_DING_ROBOT} -H 'Content-Type: application/json' -X POST -d '{\"msgtype\": \"text\", \"text\": { \"content\": \"构建项目及分支: ${env.JOB_NAME} \n状态: 部署到测试环境失败 \"}}'"
                        } else {
                          sh "curl ${env.DING_DING_ROBOT} -H 'Content-Type: application/json' -X POST -d '{\"msgtype\": \"text\", \"text\": { \"content\": \"构建项目及分支: ${env.JOB_NAME} \n状态: 构建及部署完成 \n构建时间:${currentBuild.durationString} \"}}'"
                        }
                    }
                }
            }
        }
    }
}
