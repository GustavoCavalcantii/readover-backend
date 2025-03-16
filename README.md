## COMMIT PATTERN

**-- EXEMPLO**: "feat: adicao da tela de login"

`fix` - Commits do tipo fix indicam que seu trecho de código commitado está **solucionando um problema** (bug fix), (se relaciona com o PATCH do versionamento semântico).

`feat`- Commits do tipo feat indicam que seu trecho de código está **incluindo um novo recurso** (se relaciona com o MINOR do versionamento semântico).

`docs` - Commits do tipo docs indicam que houveram **mudanças na documentação**, como por exemplo no Readme do seu repositório. (Não inclui alterações em código).

`style` - Commits do tipo style indicam que houveram **alterações referentes a formatações de código**, semicolons, trailing spaces, lint... (Não inclui alterações em código).

`refactor` - Commits do tipo refactor referem-se a mudanças devido a **refatorações que não alterem sua funcionalidade**, como por exemplo, uma alteração no formato como é processada determinada parte da tela, mas que manteve a mesma funcionalidade, ou melhorias de performance devido a um code review.

`build` - Commits do tipo build são utilizados quando são realizadas **modificações em arquivos de build e dependências**.

`test` - Commits do tipo test são utilizados quando são realizadas **alterações em testes**, seja criando, alterando ou excluindo testes unitários. (Não inclui alterações em código)

`chore` - Commits do tipo chore indicam **atualizações de tarefas de build**, configurações de administrador, pacotes... como por exemplo adicionar um pacote no gitignore. (Não inclui alterações em código)

## BRANCH PATTERN

**-- EXEMPLO**: "feat/nova-pagina-login"

- Para trabalhar em algo novo, crie uma ramificação master dê um nome descritivo
- Faça commit dessa ramificação localmente e envie regularmente seu trabalho para a mesma ramificação nomeada no servidor

## PULL REQUEST PATTERN

## Tipo de mudança

- [ ] Bug fix (mudança que não quebra o sistema e corrige um problema)
- [ ] Feat (mudança que não quebra o sistema e adiciona uma funcionalidade)
- [ ] Chore (atualização de documentação, pacotes ou testes, sem impacto direto para o usuário final)
- [ ] Release (nova versão da aplicação - apenas para produção)

## Descrição

Descrição da pull request

### Principais Mudanças
- Mudanças feitas dentro da pull request

## Lista de verificação

- [ ] Minhas mudanças têm 400 linhas ou menos
- [ ] Fiz uma auto-revisão do meu próprio código
- [ ] Comentei meu código nas áreas de difícil entendimento (se aplicável)
- [ ] Criei testes para minha correção ou funcionalidade (se aplicável)

## Dependências

Este pull request tem dependência dos seguintes outros:

- Colocar o id ou "N/A" caso não tenha
