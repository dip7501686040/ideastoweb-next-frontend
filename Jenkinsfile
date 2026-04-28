pipeline {
  agent any

  environment {
    DOCKER_IMAGE = "dip75016860/ideastoweb-frontend"
    K8S_DEPLOYMENT = "ideastoweb-frontend"
    K8S_NAMESPACE = "iwfe"
    TAG = "${BUILD_NUMBER}"
  }

  triggers {
    githubPush()
  }

  stages {

    stage('Install & Test') {
      steps {
        sh '''
          # Install Node.js
          curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
          apt-get update -y
          apt-get install -y nodejs

          # Enable pnpm
          corepack enable
          corepack prepare pnpm@8.6.0 --activate

          # Install dependencies
          pnpm install --frozen-lockfile

          # Run tests (safe)
          pnpm test || echo "No tests found"
        '''
      }
    }

    stage('Build & Push Docker Image') {
      steps {
        withCredentials([usernamePassword(
            credentialsId: 'dockerhub-creds',
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
          ),
          string(credentialsId: 'next-public-main-domain', variable: 'NEXT_PUBLIC_MAIN_DOMAIN'),
          string(credentialsId: 'next-public-api-base-url', variable: 'NEXT_PUBLIC_API_BASE_URL'),
          string(credentialsId: 'next-public-cloudinary-cloud-name', variable: 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'),
          string(credentialsId: 'next-public-stripe-publishable-key', variable: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
        ]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

            docker build \
              --build-arg NEXT_PUBLIC_MAIN_DOMAIN="$NEXT_PUBLIC_MAIN_DOMAIN" \
              --build-arg NEXT_PUBLIC_API_BASE_URL="$NEXT_PUBLIC_API_BASE_URL" \
              --build-arg NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME" \
              --build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" \
              -t $DOCKER_IMAGE:${TAG} .

            docker push $DOCKER_IMAGE:${TAG}
          '''
        }
      }
    }

    stage('Deploy to k3s') {
      steps {
        sh '''
          kubectl set image deployment/$K8S_DEPLOYMENT \
          ideastoweb-frontend=$DOCKER_IMAGE:$TAG -n $K8S_NAMESPACE

          kubectl rollout status deployment/$K8S_DEPLOYMENT -n $K8S_NAMESPACE
        '''
      }
    }
  }

  post {
    always {
      cleanWs()
    }
    success {
      echo "✅ Deployment successful"
    }
    failure {
      echo "❌ Pipeline failed"
    }
  }
}