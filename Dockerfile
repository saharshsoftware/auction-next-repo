# ---- Stage 1: Install dependencies ----
FROM public.ecr.aws/docker/library/node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ---- Stage 2: Build the application ----
FROM public.ecr.aws/docker/library/node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_BASE_URL=https://api.eauctiondekho.com
ARG NEXT_PUBLIC_DOMAIN_BASE_URL=https://eauctiondekho.com
ARG NEXT_PUBLIC_ENVIRONMENT=production
ARG NEXT_PUBLIC_IMAGE_CLOUDFRONT=https://dwqz7qa945k06.cloudfront.net
ARG NEXT_PUBLIC_TESTING_MAILS=piyush.beli@gmail.com,saurabhshukla3107@gmail.com,tazim@playmas.app,saurabh+8@gmail.com
ARG NEXT_PUBLIC_BYPASS_INTERNAL_CHECK=true

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_DOMAIN_BASE_URL=$NEXT_PUBLIC_DOMAIN_BASE_URL
ENV NEXT_PUBLIC_ENVIRONMENT=$NEXT_PUBLIC_ENVIRONMENT
ENV NEXT_PUBLIC_IMAGE_CLOUDFRONT=$NEXT_PUBLIC_IMAGE_CLOUDFRONT
ENV NEXT_PUBLIC_TESTING_MAILS=$NEXT_PUBLIC_TESTING_MAILS
ENV NEXT_PUBLIC_BYPASS_INTERNAL_CHECK=$NEXT_PUBLIC_BYPASS_INTERNAL_CHECK

RUN npm run build

# ---- Stage 3: Production runner ----
FROM public.ecr.aws/docker/library/node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV AUTH_SECRET=l24F9+mWXm0423Xc7dReus8SUKEJW72TY9XisEwgedc=
ENV NEXTAUTH_URL=l24F9+mWXm0423Xc7dReus8SUKEJW72TY9XisEwgedc=

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
CMD HOSTNAME="0.0.0.0" node server.js
