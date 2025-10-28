# Deploy no Vercel - ANCINE Dashboard

## Configuração Automática

Este projeto está configurado para deploy automático no Vercel com:

### Arquivos de Configuração

- `vercel.json` - Configuração principal do Vercel
- `.vercelignore` - Arquivos ignorados no deploy
- `vite.config.ts` - Otimizações de build

### Variáveis de Ambiente

Configure as seguintes variáveis no painel do Vercel:

```bash
VITE_API_BASE_URL=https://genuine-flight-472304-e1.rj.r.appspot.com/api/v1
```

### Deploy Manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy para produção
vercel --prod
```

### Funcionalidades Configuradas

✅ **SPA Routing** - Todas as rotas redirecionam para index.html  
✅ **Build Otimizado** - Code splitting e minificação  
✅ **Headers de Segurança** - XSS, CSRF, Content-Type protection  
✅ **Cache Estático** - Assets com cache de 1 ano  
✅ **Proxy API** - Configurado para desenvolvimento local  

### Estrutura de Build

```
dist/
├── index.html
├── assets/
│   ├── vendor-[hash].js    # React, React-DOM
│   ├── router-[hash].js    # React Router
│   ├── ui-[hash].js        # Radix UI components
│   ├── charts-[hash].js    # Recharts
│   └── query-[hash].js     # React Query
└── ...
```

### Monitoramento

- Build logs disponíveis no dashboard do Vercel
- Performance insights automáticos
- Error tracking integrado