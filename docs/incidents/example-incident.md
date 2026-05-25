# Incident: Payment session creation failed

**Data:** 2026-05-24  
**Severitat:** Alta  
**Estat:** Resolt  

## Descripció

Un usuari va intentar fer un checkout però va rebre un error 500. El log del backend va mostrar que la sessió de Stripe no es va poder crear.

## Logs rellevants

```json
{
  "level": 50,
  "requestId": "a3f2c1d0-9b8e-4a7f-b6c5-1d2e3f4a5b6c",
  "userId": "664f1a2b3c4d5e6f7a8b9c0d",
  "error": "No such customer: 'cus_invalid'",
  "msg": "Payment session creation failed"
}
```

## Causes

- La clau `STRIPE_SECRET_KEY` al `.env` estava caducada (clau de test expirada).

## Solució

1. Renovar la clau a https://dashboard.stripe.com/apikeys
2. Actualitzar el `.env` amb la nova clau
3. Reiniciar el servei

## Accions preventives

- Afegir alerta si Stripe retorna errors d'autenticació consecutius.
- Verificar la validesa de les claus en el health check.
