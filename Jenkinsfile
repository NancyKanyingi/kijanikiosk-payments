pipeline {
    agent {
        docker {
            image 'kijanikiosk-ci-agent:1.0'
            args '''
                -u root
                --network host
                -v /home/nancy/.kube:/root/.kube:ro
                -v /home/nancy/.minikube:/root/.minikube:ro
                '''
        }
    }

    environment {
        NODE_ENV  = 'test'
        BUILD_DIR = 'dist'
        APP_NAME  = 'kijanikiosk-payments'
       
        NEXUS_URL = 'http://nexus:8081/repository/npm-kijanikiosk/'
        KUBECONFIG = '/root/.kube/config'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    stages {
        stage('Lint') {
            steps {
                echo "Installing dependencies..."

                sh '''
                set -e

                rm -f .npmrc
                rm -f *.tgz

                npm ci
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
                   npm publish --registry=$NEXUS_URL || {
                     echo "Package already exists in Nexus. Skipping Publish."
                   }

                   rm -f .npmrc
                   ''' 
                }
            }
        } 
        
        stage('Deploy Serverless Staging') {
            steps {
                echo "Generating serverless staging configuration..."

                dir('serverless/kk-receipts') {
                    sh '''
                        set -e

                        npm ci --legacy-peer-deps

                        npx serverless print \
                        --stage staging \
                        --format yaml > serverless-staging.yaml
                    '''
                }

                archiveArtifacts artifacts: 'serverless/kk-receipts/serverless-staging.yaml',
                                fingerprint: true

                echo "Serverless staging verification completed."
            }
        }
        
        stage('Approve Production Deployment') {
            options {
                timeout(time: 15, unit: 'MINUTES')
            }

            steps {
                echo "======================================"
                echo "WAITING FOR PRODUCTION APPROVAL"
                echo "Open the running build page in Jenkins"
                echo "Click the 'Proceed' button"
                echo "======================================"

                input(
                    message: "Deploy kk-payments:${BUILD_NUMBER} to production?",
                    ok: "Proceed",
                    submitter: "nancy",
                    parameters: [
                        text(
                            name: "APPROVAL_REASON",
                            description: "Reason for approval (required)"
                        )
                    ]
                )
            }
        }
        

        stage('Deploy to Production') {
                    steps {
                        echo "Deploying kk-payments build ${BUILD_NUMBER} to production..."

                    sh """
            # Create a writable kubeconfig for the agent
            mkdir -p /tmp/kube
            cp /root/.kube/config /tmp/kube/config

            # Rewrite Minikube certificate paths for the Docker agent
            sed -i 's|/home/nancy/.minikube|/root/.minikube|g' /tmp/kube/config

            export KUBECONFIG=/tmp/kube/config

            # Update deployment image
            sed -i 's|image:.*kk-payments.*|image: kijanikiosk/kk-payments:${BUILD_NUMBER}|' k8s/kk-payments-deployment.yaml

            kubectl apply -f k8s/kk-payments-deployment.yaml -n kijani-project
            kubectl rollout status deployment/kk-payments -n kijani-project
        """
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
