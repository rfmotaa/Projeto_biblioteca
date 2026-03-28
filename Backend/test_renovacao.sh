#!/bin/bash

# Script de Teste - Limite de Renovações
# Este script testa a funcionalidade de limite máximo de 2 renovações

BASE_URL="http://localhost:8080"
MAX_RENOVACOES=2

echo "======================================"
echo "Teste de Limite de Renovações"
echo "======================================"
echo ""

# Teste 1: Verificar empréstimos ativos
echo "1. Buscando empréstimos ativos..."
ATIVOS=$(curl -s "$BASE_URL/emprestimos/ativos" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')

if [ -z "$ATIVOS" ]; then
    echo "   ❌ Nenhum empréstimo ativo encontrado"
    echo "   Criando um empréstimo de teste..."
    # Você precisará criar um empréstimo primeiro
    exit 1
fi

echo "   ✅ Empréstimo ativo encontrado: ID $ATIVOS"
echo ""

# Teste 2: Verificar numeroRenovacoes inicial
echo "2. Verificando numeroRenovacoes inicial..."
RENOVACOES=$(curl -s "$BASE_URL/emprestimos/$ATIVOS" | grep -o '"numeroRenovacoes":[0-9]*' | grep -o '[0-9]*')
echo "   Renovações atuais: $RENOVACOES"
echo ""

# Teste 3: Primeira renovação
echo "3. Tentando primeira renovação..."
RESPOSTA=$(curl -s -X PATCH "$BASE_URL/emprestimos/$ATIVOS/renovar")
if echo "$RESPOSTA" | grep -q "numeroRenovacoes"; then
    NOVA_RENOVACAO=$(echo "$RESPOSTA" | grep -o '"numeroRenovacoes":[0-9]*' | grep -o '[0-9]*')
    echo "   ✅ Primeira renovação realizada! Renovações: $NOVA_RENOVACAO"
else
    echo "   ❌ Erro na primeira renovação"
    echo "   $RESPOSTA"
fi
echo ""

# Teste 4: Segunda renovação
echo "4. Tentando segunda renovação..."
RESPOSTA=$(curl -s -X PATCH "$BASE_URL/emprestimos/$ATIVOS/renovar")
if echo "$RESPOSTA" | grep -q "numeroRenovacoes"; then
    NOVA_RENOVACAO=$(echo "$RESPOSTA" | grep -o '"numeroRenovacoes":[0-9]*' | grep -o '[0-9]*')
    echo "   ✅ Segunda renovação realizada! Renovações: $NOVA_RENOVACAO"
else
    echo "   ❌ Erro na segunda renovação"
    echo "   $RESPOSTA"
fi
echo ""

# Teste 5: Terceira renovação (deve falhar)
echo "5. Tentando terceira renovação (deve ser bloqueada)..."
RESPOSTA=$(curl -s -X PATCH "$BASE_URL/emprestimos/$ATIVOS/renovar")
if echo "$RESPOSTA" | grep -q "limite máximo"; then
    echo "   ✅ Terceira renovação bloqueada corretamente!"
    echo "   Mensagem: $(echo "$RESPOSTA" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)"
else
    echo "   ❌ Erro: terceira renovação deveria ser bloqueada"
    echo "   $RESPOSTA"
fi
echo ""

# Teste 6: Verificar estado final no banco
echo "6. Verificando estado final no banco..."
RENOVACOES_FINAL=$(mysql -u root -pRafa/100 Biblioteca -se "SELECT numero_renovacoes FROM emprestimo WHERE id_emprestimo = $ATIVOS;" 2>&1 | grep -v "Warning")
echo "   Renovações finais: $RENOVACOES_FINAL"
if [ "$RENOVACOES_FINAL" = "2" ]; then
    echo "   ✅ Valor correto no banco!"
else
    echo "   ❌ Valor incorreto. Esperado: 2, Recebido: $RENOVACOES_FINAL"
fi
echo ""

echo "======================================"
echo "Testes concluídos!"
echo "======================================"
