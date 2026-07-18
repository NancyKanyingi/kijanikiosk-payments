pipeline {
    agent {
        docker {
            image 'kijanikiosk-ci-agent:1.0'
            args '-u root'
        }
    }

    environment {
        NODE_ENV  = 'test'
        BUILD_DIR = 'dist'
        APP_NAME  = 'kijanikiosk-payments'
       
        NEXUS_URL = 'http://nexus:8081/repository/npm-kijanikiosk/'
       
    }

    options {
        timeout(time: 15, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    stages {
        stage('Lint') {
            steps {
                echo "Installing dependencies..."

                sh '''
                set -eux

                echo "Node version:"
                node -v

                echo "NPM version:"
                npm -v

                echo "Working directory:"
                pwd

                echo "Workspace contents:"
                ls -la

                npm ci || {
                    echo "===== npm debug log ====="
                    cat /root/.npm/_logs/*-debug-0.log || true
                    exit 1
                    }
                '''

                sh 'npm run lint'
            }
        }
        stage('Build') {
            steps {
                echo "Preparing build for ${APP_NAME}..."
                
                sh 'node --version'


                echo "Building application..."
                sh 'npm run build'

                echo "Verifying build output..."
                sh '''
                    set -e
                    test -d "${BUILD_DIR}" || {
                        echo "ERROR: build directory not found"
                        exit 1
                    }
                    echo "Build output verified."
                '''
            }    
        }

        stage('Version') {
            steps {
                sh '''
                git config --global --add safe.directory "$WORKSPACE"
                '''
                script {
                    env.GIT_SHA = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()

                    env.PACKAGE_VERSION = "1.0.0-${env.GIT_SHA}"
                }

                sh '''
                    npm version ${PACKAGE_VERSION} --no-git-tag-version
                    npm pack
                '''

                echo "Publishing version ${PACKAGE_VERSION}"
            }
        }

       stage('Verify') {
            parallel {

                stage('Test') {
                    steps {
                        echo "Running test suite for ${APP_NAME}..."

                        sh '''
                            set -e
                            npm test
                        '''
                    }
                }

                stage('Security Audit') {
                    steps {
                        echo "Running npm security audit..."

                        sh '''
                            set -e
                            npm audit --audit-level=high
                        '''
                    }
                }

            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker image for ${APP_NAME}..."

                sh """
                    docker build -t ${APP_NAME}:${BUILD_NUMBER} .
                """

                echo "Docker image built successfully."
            }
        }

        stage('Archive') {
            steps {
                echo "Archiving build artifact for ${APP_NAME} build ${BUILD_NUMBER}..."

                archiveArtifacts artifacts: "${BUILD_DIR}/**",
                                fingerprint: true,
                                onlyIfSuccessful: true

                echo "Artifact archived. Download from: ${BUILD_URL}artifact/"
            }
        }

        stage('Publish') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'nexus-credentials',
                        usernameVariable: 'NEXUS_USER',
                        passwordVariable: 'NEXUS_PASS'
                    )
                ]) {
                   sh '''
                   set -eux

                   echo "Publishing package to Nexus..."

                   echo "registry=$NEXUS_URL" > .npmrc
                   echo "always-auth=true" >> .npmrc
                   echo "//nexus:8081/repository/npm-kijanikiosk/:username=$NEXUS_USER" >> .npmrc
                   echo "//nexus:8081/repository/npm-kijanikiosk/:_password=$(printf "%s" "$NEXUS_PASS" | base64 -w0)" >> .npmrc
                   echo "//nexus:8081/repository/npm-kijanikiosk/:email=ci@example.com" >> .npmrc

                   echo "===== .npmrc ====="
                   cat .npmrc

                   echo "===== npm publish ====="
                   npm publish --registry=$NEXUS_URL

                   rm -f .npmrc
                   ''' 
                }
            }
        }  
    }


    post {

        always {
            echo "Build URL: ${BUILD_URL}"
        }

        success {
            echo "Artifact published successfully."
            echo "${BUILD_URL}artifact/"
        }

        failure {
            echo "Pipeline failed."
        }

        changed {
            echo "Build status changed."
        }
    }
}
