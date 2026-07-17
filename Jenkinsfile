pipeline {
    agent {
        docker {
            image 'node:18-alpine'
        }
    }

    environment {
        NODE_ENV  = 'test'
        BUILD_DIR = 'dist'
        APP_NAME  = 'kijanikiosk-payments'
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

                sh 'npm ci'

                echo "Running ESLint..."

                sh 'npm run lint'
            }
        }
        stage('Build') {
            steps {
                echo "Installing dependencies for ${APP_NAME}..."
                
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

        stage('Archive') {
            steps {
                echo "Archiving build artifact for ${APP_NAME} build ${BUILD_NUMBER}..."

                archiveArtifacts artifacts: "${BUILD_DIR}/**",
                                fingerprint: true,
                                onlyIfSuccessful: true

                echo "Artifact archived. Download from: ${BUILD_URL}artifact/"
            }
        }

        stage('Credential Test') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'nexus-credentials',
                        usernameVariable: 'NEXUS_USER',
                        passwordVariable: 'NEXUS_PASS'
                    )
                ]) {
                    sh '''
                        echo "User: $NEXUS_USER Pass: $NEXUS_PASS"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline succeeded: ${APP_NAME} build ${BUILD_NUMBER}"
        }

        failure {
            echo "Pipeline FAILED: ${APP_NAME} build ${BUILD_NUMBER} - check logs"
        }

        always {
            echo "Build URL: ${BUILD_URL}"
        }
    }
}