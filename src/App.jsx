import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from "recharts";

// ─── RAW DATA (real, extracted from spreadsheet) ───────────────────────────
const RAW = [
  ["18/02/2026","Serviços","De R$ 300 mil a R$ 500 mil","Vendas","Sou Mentorado"],
  ["18/02/2026","Educação","Até R$ 300 mil","Vendas","Sou Convidado de Mentorado"],
  ["18/02/2026","Serviços","De R$ 2 milhões a R$ 5 milhões","Escala e previsibilidade financeira","Sou Mentorado"],
  ["18/02/2026","Serviços","De R$ 2 milhões a R$ 5 milhões","Aumento de clientes","Sou Mentorado"],
  ["18/02/2026","Tecnologia","Até R$ 300 mil","Vendas e Gestão Financeira","Sou Mentorado"],
  ["18/02/2026","Outros","Até R$ 300 mil","Investimento","Sou convidado da Equipe"],
  ["18/02/2026","Tecnologia","Até R$ 300 mil","Startup nova","Faço parte do Clube"],
  ["18/02/2026","Construção Civil","Acima de R$ 10 milhões","Organização","Sou Mentorado"],
  ["18/02/2026","Educação","Até R$ 300 mil","Validação de processo","Sou Convidado da Última Edição"],
  ["18/02/2026","Serviços","Até R$ 300 mil","Geração de demanda qualificada","Sou Mentorado"],
  ["18/02/2026","Serviços","De R$ 500 mil a R$ 1 milhão","Falta de mão de obra e controle financeiro","Sou Convidado de Mentorado"],
  ["18/02/2026","Serviços","Acima de R$ 10 milhões","Pessoas","Sou Convidado de Mentorado"],
  ["18/02/2026","Serviços","De R$ 500 mil a R$ 1 milhão","Falta de aculturamento empresarial","Sou Mentorado"],
  ["18/02/2026","Comércio","De R$ 1 milhão a R$ 2 milhões","Financiamento","Sou Convidado de Mentorado"],
  ["19/02/2026","Fast food","De R$ 1 milhão a R$ 2 milhões","Expandir","Sou convidado"],
  ["20/02/2026","Agropecuária","Até R$ 300 mil","Aumentar a renda","Sou Convidado de Mentorado"],
  ["20/02/2026","Varejo","De R$ 300 mil a R$ 500 mil","Gestão","Sou Convidado da Última Edição"],
  ["20/02/2026","Marketing Imobiliário","De R$ 500 mil a R$ 1 milhão","Aumento de oportunidades qualificadas","Sou Convidado de Mentorado"],
  ["20/02/2026","Tecnologia","Até R$ 300 mil","Crescer mais","Sou Convidado de Mentorado"],
  ["23/02/2026","Serviços","De R$ 300 mil a R$ 500 mil","Profissionais","Sou Mentorado"],
  ["23/02/2026","Tecnologia","De R$ 300 mil a R$ 500 mil","Teste","Sou conselheiro"],
  ["23/02/2026","Serviços","Até R$ 300 mil","Escalar","Sou convidado da Equipe"],
  ["23/02/2026","Tecnologia","Até R$ 300 mil","Prospecção","Sou convidado da Equipe"],
  ["23/02/2026","Serviços","Até R$ 300 mil","Atendimento de pessoas","Sou convidado da Equipe"],
  ["23/02/2026","Serviços","De R$ 5 milhões a R$ 10 milhões","Estruturação operacional e administrativa","Sou Convidado da Última Edição"],
  ["23/02/2026","Indústria","De R$ 300 mil a R$ 500 mil","Escalar",""],
  ["23/02/2026","Imobiliário","De R$ 500 mil a R$ 1 milhão","Muitas coisas","Sou convidado da Equipe"],
  ["23/02/2026","Indústria","De R$ 500 mil a R$ 1 milhão","Vendas",""],
  ["24/02/2026","Telecomunicação","De R$ 300 mil a R$ 500 mil","Aumento nas vendas","Fui convidado por um amigo"],
  ["24/02/2026","Franquia","Acima de R$ 10 milhões","Marca","Sou Convidado de Mentorado"],
  ["24/02/2026","Saúde","Até R$ 300 mil","Alavancagem e organização financeira","Sou convidado da Equipe"],
  ["24/02/2026","Construção Civil","Acima de R$ 10 milhões","Vendas","Sou Convidado de Palestrante"],
  ["24/02/2026","Alimentação","Até R$ 300 mil","Abrir o negócio","Sou Convidado de Palestrante"],
  ["24/02/2026","Serviços","Até R$ 300 mil","Venda Previsível","Sou Mentorado"],
  ["24/02/2026","Serviços","Até R$ 300 mil","Clientes Qualificados","Sou convidado da Equipe"],
  ["24/02/2026","Varejo","Até R$ 300 mil","Gestão e fluxo de caixa","Sou Convidado de Mentorado"],
  ["24/02/2026","Indústria","De R$ 500 mil a R$ 1 milhão","Criação e implementação de processos","Sou Convidado de Mentorado"],
  ["24/02/2026","Outros","De R$ 300 mil a R$ 500 mil","Administração","Sou Convidado da Última Edição"],
  ["24/02/2026","Imobiliário","Até R$ 300 mil","Taxa de Juros","Sou convidado da Equipe"],
  ["24/02/2026","Serviços","Até R$ 300 mil","Fiscal","Sou convidado da Equipe"],
  ["24/02/2026","Varejo","Até R$ 300 mil","Faturamento","Sou convidado da Equipe"],
  ["24/02/2026","Tecnologia","Até R$ 300 mil","Faturamento","Sou convidado da Equipe"],
  ["24/02/2026","Varejo","Até R$ 300 mil","Escala de vendas","Sou Convidado de Mentorado"],
  ["24/02/2026","Serviços","De R$ 500 mil a R$ 1 milhão","Posicionamento de mercado","Sou Convidado de Palestrante"],
  ["24/02/2026","Educação","Até R$ 300 mil","Apresentar valor e saúde financeira","Sou convidada de uma convidada"],
  ["24/02/2026","Educação","Até R$ 300 mil","Apresentar valor do trabalho","Sou convidada de uma convidada"],
  ["24/02/2026","Tecnologia","De R$ 300 mil a R$ 500 mil","Teste","Sou Convidado de Palestrante"],
  ["24/02/2026","Tecnologia","Até R$ 300 mil","Comunicação","Sou convidado da Equipe"],
  ["24/02/2026","Saúde","Até R$ 300 mil","Fidelizar clientes","Sou convidado da Equipe"],
  ["24/02/2026","Serviços","Até R$ 300 mil","Publicidade","Amigo indicou"],
  ["24/02/2026","Serviços","Até R$ 300 mil","Vendas crescimento visibilidade","Sou convidado da Equipe"],
  ["24/02/2026","Serviços","De R$ 1 milhão a R$ 2 milhões","Crescimento do faturamento","Sou Convidado de Mentorado"],
  ["24/02/2026","Indústria","De R$ 2 milhões a R$ 5 milhões","Disponibilidade de capital","Sou convidado da Equipe"],
  ["25/02/2026","Serviços","De R$ 300 mil a R$ 500 mil","Busca de novos clientes","Sou convidado da Equipe"],
  ["25/02/2026","Construção Civil","De R$ 500 mil a R$ 1 milhão","Mão de obra","Sou Convidado de Mentorado"],
  ["25/02/2026","Alimentação","Acima de R$ 10 milhões","Processos","Sou Convidado de Mentorado"],
  ["25/02/2026","Tecnologia","De R$ 500 mil a R$ 1 milhão","Custo de operação","Sou convidado da Equipe"],
  ["25/02/2026","Tecnologia","De R$ 2 milhões a R$ 5 milhões","Lead","Sou convidado da Equipe"],
  ["25/02/2026","Indústria","Até R$ 300 mil","Atualização e formação de equipe","Sou convidado da Equipe"],
  ["25/02/2026","Tecnologia","De R$ 300 mil a R$ 500 mil","Ser competitivo","Sou Convidado da Última Edição"],
  ["25/02/2026","Serviços","De R$ 300 mil a R$ 500 mil","Processo comercial","Sou Convidado de Mentorado"],
  ["25/02/2026","Alimentício","De R$ 300 mil a R$ 500 mil","Mão de obra",""],
  ["26/02/2026","Saúde","Até R$ 300 mil","Faturamento","Sou Convidado de Mentorado"],
  ["26/02/2026","Tecnologia","De R$ 1 milhão a R$ 2 milhões","Crescer carteira de clientes","Indicação de um amigo"],
  ["26/02/2026","Varejo","De R$ 500 mil a R$ 1 milhão","Financeiro","Sou Convidado de Mentorado"],
  ["26/02/2026","Serviços","Até R$ 300 mil","Pós venda","Sou Convidado de Palestrante"],
  ["26/02/2026","Varejo","De R$ 5 milhões a R$ 10 milhões","Prazo com fornecedores","Instagram"],
  ["26/02/2026","Tecnologia","De R$ 300 mil a R$ 500 mil","Retenção","Sou convidado da Equipe"],
  ["26/02/2026","Imobiliário","De R$ 300 mil a R$ 500 mil","Alavancar","Sou convidado da Equipe"],
  ["26/02/2026","Educação","Até R$ 300 mil","Posicionamento nacional e escala estruturada","Sou convidado do Antônio Fogaça"],
  ["27/02/2026","Indústria","Até R$ 300 mil","Patente e captação de investidor","Convidado pelo sócio"],
  ["27/02/2026","Serviços","De R$ 500 mil a R$ 1 milhão","Mão de obra qualificada","Sou Convidado de Mentorado"],
  ["27/02/2026","Serviços","De R$ 500 mil a R$ 1 milhão","Mão de obra qualificada","Sou Convidado de Mentorado"],
  ["27/02/2026","Indústria","Até R$ 300 mil","Organização","Sou funcionária"],
  ["27/02/2026","Saúde","De R$ 500 mil a R$ 1 milhão","Colaboradores","Sou Convidado de Mentorado"],
  ["27/02/2026","Serviços","Até R$ 300 mil","Atualização tecnologia automação","Sou Convidado de Palestrante"],
  ["28/02/2026","Serviços","Até R$ 300 mil","Marketing","Sou Convidado da Última Edição"],
  ["28/02/2026","Tecnologia","De R$ 2 milhões a R$ 5 milhões","Investimento e Capital de Giro","Sou Convidado de Mentorado"],
  ["28/02/2026","Marketing Digital","De R$ 300 mil a R$ 500 mil","Administração da empresa","Sou Convidado de Mentorado"],
  ["02/03/2026","Serviços","Até R$ 300 mil","Empresa em planejamento","Sou Convidado de Mentorado"],
  ["02/03/2026","Varejo","De R$ 500 mil a R$ 1 milhão","Concorrência forte","Sou Convidado de Mentorado"],
  ["02/03/2026","Serviços","Até R$ 300 mil","A dor do crescimento financeiro","Sou Convidado de Mentorado"],
  ["02/03/2026","Serviços","Até R$ 300 mil","Não possui empresa","Sou Convidado de Mentorado"],
  ["02/03/2026","Serviços","Até R$ 300 mil","SP","Sou Convidado de Mentorado"],
  ["02/03/2026","Tecnologia","Até R$ 300 mil","Escala","Sou Convidado de Mentorado"],
  ["02/03/2026","Tecnologia","Até R$ 300 mil","N/A","Sou Convidado de Palestrante"],
  ["02/03/2026","Tecnologia","Até R$ 300 mil","Vender","Sou Convidado de Palestrante"],
  ["03/03/2026","Construção Civil","De R$ 1 milhão a R$ 2 milhões","Leads qualificados","Sou convidado da Equipe"],
  ["03/03/2026","Tecnologia","Até R$ 300 mil","Vendas","Sou convidado da Equipe"],
  ["03/03/2026","Tecnologia","Até R$ 300 mil","Vendas","Sou convidado da Equipe"],
  ["03/03/2026","Varejo","Acima de R$ 10 milhões","Adequação Fiscal e Gestão de Pessoas","Sou convidado da Equipe"],
  ["03/03/2026","Imobiliário","De R$ 2 milhões a R$ 5 milhões","Consistência e previsibilidade e gestão de equipe","Sou Convidado de Palestrante"],
  ["03/03/2026","Serviços","Até R$ 300 mil","Organização de gestão","Sou Mentorado"],
  ["03/03/2026","Serviços","De R$ 2 milhões a R$ 5 milhões","Imposto","Fogaça"],
  ["03/03/2026","Tecnologia","Até R$ 300 mil","Infraestrutura","Sou Convidado de Mentorado"],
  ["03/03/2026","Eventos","Até R$ 300 mil","Mercado financeiro","Sou Convidado de Palestrante"],
  ["03/03/2026","Jurídico","De R$ 300 mil a R$ 500 mil","Gestão de tempo e equipe","Sou Convidado de Palestrante"],
  ["03/03/2026","Serviços","De R$ 500 mil a R$ 1 milhão","Gestão de pessoal","Sou Convidado de Palestrante"],
  ["03/03/2026","Imobiliário","De R$ 500 mil a R$ 1 milhão","Estratégia digital","Sou Convidado de Mentorado"],
  ["03/03/2026","Imobiliário","De R$ 300 mil a R$ 500 mil","Destaque no mercado","Sou Convidado de Mentorado"],
  ["03/03/2026","Imobiliário","Até R$ 300 mil","Ser destaque no mercado","Sou Convidado de Mentorado"],
  ["03/03/2026","Representação Comercial","De R$ 5 milhões a R$ 10 milhões","Time","Sou convidado da Equipe"],
  ["03/03/2026","Construção Civil","De R$ 300 mil a R$ 500 mil","Estruturação e Crescimento","Sou Convidado de Palestrante"],
  ["03/03/2026","Imobiliário","De R$ 300 mil a R$ 500 mil","Objeções","Sou Convidado de Mentorado"],
  ["03/03/2026","Outros","Até R$ 300 mil","Novas conexões","Sou convidado da Equipe"],
  ["03/03/2026","Construção Civil","Até R$ 300 mil","Alavancar novos clientes","Sou Convidado de Palestrante"],
  ["03/03/2026","Imobiliário","Até R$ 300 mil","Networking","Sou Convidado de Palestrante"],
  ["03/03/2026","Franquia","De R$ 1 milhão a R$ 2 milhões","Contratação","Sou Convidado de Palestrante"],
  ["03/03/2026","Digital","Até R$ 300 mil","Administração","Sou Convidado de Palestrante"],
  ["03/03/2026","Construção Civil","Até R$ 300 mil","Tecnologias","Sou Convidado de Palestrante"],
  ["03/03/2026","Serviços","Até R$ 300 mil","Não identificou","Convidado de Empresário"],
  ["04/03/2026","Tecnologia","Acima de R$ 10 milhões","Continuar avançando","Outro empresário me convidou"],
  ["04/03/2026","Construção Civil","Até R$ 300 mil","Reestruturação financeira","Sou Convidado de Mentorado"],
  ["04/03/2026","Construção Civil","De R$ 500 mil a R$ 1 milhão","Time comercial","Sou convidado da Equipe"],
  ["04/03/2026","Jurídico","De R$ 500 mil a R$ 1 milhão","Crescer",""],
  ["04/03/2026","Educação","De R$ 300 mil a R$ 500 mil","Estruturação e gestão","Sou Convidado de Palestrante"],
  ["04/03/2026","Construção Civil","Até R$ 300 mil","Gestão","Sou Convidado de Palestrante"],
  ["04/03/2026","Construção Civil","Até R$ 300 mil","Falta de Mão de Obra","Sou Convidado de Mentorado"],
  ["04/03/2026","Indústria","De R$ 300 mil a R$ 500 mil","Alavancagem de vendas","Sou Convidado de Mentorado"],
  ["04/03/2026","Imobiliário","Até R$ 300 mil","Estruturar time","Sou convidado da Equipe"],
  ["04/03/2026","Serviços","De R$ 2 milhões a R$ 5 milhões","Crescimento em escala","Sou Convidado de Mentorado"],
  ["04/03/2026","Serviços","De R$ 500 mil a R$ 1 milhão","Acertar o perfil dos clientes","Sou convidado da Equipe"],
  ["04/03/2026","Indústria","De R$ 500 mil a R$ 1 milhão","","Sou convidado da Equipe"],
  ["04/03/2026","Tecnologia (TechAG)","De R$ 1 milhão a R$ 2 milhões","Escalar a produção e distribuição regional","Sou Convidado de Mentorado"],
  ["04/03/2026","Seguros","De R$ 500 mil a R$ 1 milhão","Automação e IA","Sou Convidado de Palestrante"],
  ["04/03/2026","Educação","Até R$ 300 mil","Consolidação",""],
  ["04/03/2026","Serviços","Até R$ 300 mil","Comercial",""],
  ["05/03/2026","Construção Civil","De R$ 500 mil a R$ 1 milhão","Gestão","Sou Mentorado"],
  ["05/03/2026","Varejo","Até R$ 300 mil","Pessoal para trabalhar","Sou Convidado de Palestrante"],
  ["05/03/2026","Serviços","De R$ 1 milhão a R$ 2 milhões","Adaptação às novas tecnologias",""],
  ["05/03/2026","Saúde","Até R$ 300 mil","Profissionais comprometidos","Sou Convidado de Palestrante"],
  ["05/03/2026","Saúde","De R$ 2 milhões a R$ 5 milhões","Gestão financeira e atração de talentos","Sou convidado da Equipe"],
  ["05/03/2026","Advocacia","De R$ 500 mil a R$ 1 milhão","Captação de cliente","Sou Convidado de Palestrante"],
  ["05/03/2026","Indústria","Até R$ 300 mil","Crescimento","Sou Convidado de Mentorado"],
  ["05/03/2026","Serviços","Até R$ 300 mil","Processos e vendas","Sou convidado da Equipe"],
  ["05/03/2026","Serviços","Até R$ 300 mil","Demanda","Sou Convidado de Mentorado"],
  ["05/03/2026","Tecnologia","De R$ 300 mil a R$ 500 mil","Novos clientes",""],
  ["05/03/2026","Outros","De R$ 300 mil a R$ 500 mil","Não tem!","Convidado de rede sociais"],
  ["05/03/2026","Imobiliário","De R$ 300 mil a R$ 500 mil","Cenário complexo e mudanças","Sou Convidado de Mentorado"],
  ["05/03/2026","Automóveis","De R$ 5 milhões a R$ 10 milhões","Funcionar sozinha",""],
  ["05/03/2026","Indústria","De R$ 5 milhões a R$ 10 milhões","Mão de obra","Sou Mentorado"],
  ["06/03/2026","Investimentos","De R$ 2 milhões a R$ 5 milhões","Encontrar parceiros","Sou Convidado de Mentorado"],
  ["06/03/2026","Educação","Acima de R$ 10 milhões","Gestão","Sou Convidado de Mentorado"],
  ["06/03/2026","Tecnologia","Até R$ 300 mil","Prospecção de novos clientes","Sou Mentorado"],
  ["06/03/2026","Educação","Até R$ 300 mil","Iniciar a operação","Sou Convidado de Mentorado"],
  ["06/03/2026","Varejo","Até R$ 300 mil","Conseguir investidores","Sou Convidado de Palestrante"],
  ["06/03/2026","Tecnologia","Até R$ 300 mil","Construção de base de mercado","Sou Mentorado"],
  ["06/03/2026","Saúde","Até R$ 300 mil","Estrutura","Sou convidado da Equipe"],
  ["06/03/2026","Saúde","Até R$ 300 mil","Foco estratégico e construir autoridade","Sou Mentorado"],
  ["06/03/2026","Serviços","De R$ 500 mil a R$ 1 milhão","Tempo e estratégia de captação","Sou Convidado de Mentorado"],
  ["06/03/2026","Educação","Até R$ 300 mil","Escala e Venda","Sou Convidado de Mentorado"],
  ["06/03/2026","Construção Civil","Até R$ 300 mil","Crescimento","Sou Convidado de Mentorado"],
  ["06/03/2026","Construção Civil","Até R$ 300 mil","Crescimento","Sou Convidado de Mentorado"],
  ["06/03/2026","Serviços","Até R$ 300 mil","?","Sou Convidado de Palestrante"],
  ["06/03/2026","Construção Civil","De R$ 300 mil a R$ 500 mil","Mão de obra","Sou Mentorado"],
  ["06/03/2026","Tecnologia","Até R$ 300 mil","Exponenciar","Sou Convidado de Mentorado"],
  ["06/03/2026","Tecnologia","Até R$ 300 mil","Exponenciar","Sou Convidado de Mentorado"],
  ["06/03/2026","Tecnologia","Até R$ 300 mil","Consultora ERP","Sou convidado"],
  ["06/03/2026","Educação","De R$ 1 milhão a R$ 2 milhões","Escalar a formação de mentores","Sou Convidado de Palestrante"],
  ["06/03/2026","Imobiliário","Acima de R$ 10 milhões","Equipe","Sou Convidado de Mentorado"],
  ["06/03/2026","Tecnologia","Até R$ 300 mil","Falta de visibilidade e credibilidade","Sou Convidado de Mentorado"],
  ["06/03/2026","Indústria","De R$ 1 milhão a R$ 2 milhões","Gestão","Sou convidado da Equipe"],
  ["06/03/2026","Vendas","Até R$ 300 mil","Iniciar no mercado","Sou convidado da Equipe"],
  ["06/03/2026","Marketing","Até R$ 300 mil","Transição de carreira","Sou convidado da Equipe"],
  ["06/03/2026","Indústria","De R$ 500 mil a R$ 1 milhão","Falta de organização","Sou Convidado de Mentorado"],
  ["06/03/2026","Indústria","De R$ 500 mil a R$ 1 milhão","Vendas","Sou Convidado de Mentorado"],
  ["06/03/2026","Serviços","De R$ 1 milhão a R$ 2 milhões","Escassez de mão-de-obra qualificada","Sou Convidado de Mentorado"],
  ["07/03/2026","Varejo","Até R$ 300 mil","Posicionar em vendas consultivas","Sou convidado da Equipe"],
  ["08/03/2026","Serviços","De R$ 300 mil a R$ 500 mil","Expansão e captação de novos clientes","Convidado"],
  ["08/03/2026","Tecnologia","De R$ 500 mil a R$ 1 milhão","Investidor e parceiros","Sou Convidado de Palestrante"],
  ["08/03/2026","Varejo","De R$ 300 mil a R$ 500 mil","Gestão de pessoas",""],
  ["08/03/2026","Indústria","De R$ 5 milhões a R$ 10 milhões","Gestão de pessoas","Sou Convidado de Palestrante"],
  ["09/03/2026","Educação","Até R$ 300 mil","Estruturação","Sou convidado da Equipe"],
  ["09/03/2026","Imobiliário","De R$ 300 mil a R$ 500 mil","Novos clientes","Sou conselheiro"],
  ["09/03/2026","Varejo","De R$ 2 milhões a R$ 5 milhões","Falta de processos e escalagem","Sou conselheiro"],
  ["09/03/2026","Imobiliário","De R$ 2 milhões a R$ 5 milhões","Alguns","Sou conselheiro"],
  ["09/03/2026","Máquinas/Café","De R$ 500 mil a R$ 1 milhão","Migrar para modelo profissional","Sou conselheiro"],
  ["09/03/2026","Educação","De R$ 300 mil a R$ 500 mil","Fluxo de caixa previsível","Sou convidado da Equipe"],
  ["09/03/2026","Tecnologia","Até R$ 300 mil","Prospectar clientes","Sou convidado da Equipe"],
  ["09/03/2026","Joalheria","Até R$ 300 mil","Mão de obra qualificada","Sou Convidado da Última Edição"],
  ["09/03/2026","Serviços","De R$ 300 mil a R$ 500 mil","Ambiente de negócios","Sou Convidado de Mentorado"],
  ["09/03/2026","Varejo","De R$ 500 mil a R$ 1 milhão","Margem de lucro apertada","Sou Convidado de Palestrante"],
  ["09/03/2026","Varejo","De R$ 500 mil a R$ 1 milhão","Margem de lucro apertada","Sou Convidado de Palestrante"],
  ["09/03/2026","Serviços","Até R$ 300 mil","Expansão no agronegócio","Sou Convidado de Palestrante"],
  ["09/03/2026","Imobiliário","Até R$ 300 mil","Falta de reciprocidade","Sou Convidado da Última Edição"],
  ["09/03/2026","Beleza","Até R$ 300 mil","Vendas","Amigo"],
  ["09/03/2026","Beleza","Até R$ 300 mil","Relacionamento","Amigo"],
  ["09/03/2026","Imobiliário","De R$ 1 milhão a R$ 2 milhões","Gerar leads certos e autoridade digital","Sou Convidado de Mentorado"],
  ["09/03/2026","Serviços","Até R$ 300 mil","Processos de Vendas","Sou Convidado de Mentorado"],
  ["09/03/2026","Advocacia","Até R$ 300 mil","Captação de clientes","Sou Convidado de Mentorado"],
  ["09/03/2026","Serviços","Até R$ 300 mil","Volume de vendas","Sou convidado da Equipe"],
  ["09/03/2026","Tecnologia","De R$ 1 milhão a R$ 2 milhões","Potencializar vendas","Sou convidado da Equipe"],
  ["09/03/2026","Tecnologia","De R$ 300 mil a R$ 500 mil","Falta de marketing estratégico","Sou Convidado de Mentorado"],
  ["09/03/2026","Serviços","Até R$ 300 mil","Desenvolvimento estrutural","Sou Convidado da Última Edição"],
  ["09/03/2026","Serviços","De R$ 1 milhão a R$ 2 milhões","Contratação","Sou Convidado de Palestrante"],
  ["09/03/2026","Mercado Financeiro","Até R$ 300 mil","Digitalização e regulamentação","Sou conselheiro"],
  ["09/03/2026","Educação","Até R$ 300 mil","Escala","Sou Convidado de Mentorado"],
  ["09/03/2026","Educação","Até R$ 300 mil","Falta estratégia","Sou convidado da Equipe"],
  ["09/03/2026","Educação","Até R$ 300 mil","Estagnação de faturamento","Sou Convidado de Mentorado"],
  ["09/03/2026","Joalheria","Até R$ 300 mil","Contratar Mão de Obra Qualificada",""],
  ["09/03/2026","Eventos","Até R$ 300 mil","Captar clientes","1ª vez"],
  ["09/03/2026","Tecnologia","Até R$ 300 mil","Escalar a empresa","Sou convidado da Equipe"],
  ["10/03/2026","Serviços","Até R$ 300 mil","Todos","Sou Convidado de Palestrante"],
  ["10/03/2026","Serviços","De R$ 500 mil a R$ 1 milhão","Escalar através das pessoas","Sou Convidado de Mentorado"],
  ["10/03/2026","Construção Civil","Até R$ 300 mil","Mídia",""],
  ["10/03/2026","Arquitetura","De R$ 500 mil a R$ 1 milhão","Captação e crescimento","Sou convidada de participante"],
  ["10/03/2026","Serviços","Até R$ 300 mil","Reestruturação","Sou conselheiro"],
  ["10/03/2026","Serviços","Até R$ 300 mil","","Sou conselheiro"],
  ["10/03/2026","Tecnologia","De R$ 300 mil a R$ 500 mil","Gestão","Sou convidado da Equipe"],
  ["10/03/2026","Indústria","De R$ 300 mil a R$ 500 mil","Gestão","Sou convidado da Equipe"],
  ["10/03/2026","Saúde","Até R$ 300 mil","Aumentar faturamento e escalar vendas","Sou convidado da Equipe"],
  ["10/03/2026","Educação","Até R$ 300 mil","Captar clientes","Sou convidado da Equipe"],
  ["10/03/2026","Financeiro","Até R$ 300 mil","Prospecção de qualidade","Sou Convidado de Palestrante"],
  ["10/03/2026","Imobiliário","De R$ 300 mil a R$ 500 mil","Escalar o negócio","Sou convidado da Equipe"],
  ["10/03/2026","Indústria","De R$ 300 mil a R$ 500 mil","Gestão","Sou Convidado da Última Edição"],
  ["10/03/2026","Tecnologia","Até R$ 300 mil","Mostrar produto ao cliente","Sou Convidado de Mentorado"],
  ["10/03/2026","Auditoria Judicial","De R$ 5 milhões a R$ 10 milhões","Atender demanda","Sou Convidado de Palestrante"],
  ["10/03/2026","Auditoria Judicial","De R$ 5 milhões a R$ 10 milhões","Atender demanda","Sou Convidado de Palestrante"],
  ["10/03/2026","Saúde","Até R$ 300 mil","Leads qualificados e atração de clientes",""],
  ["10/03/2026","Varejo","Até R$ 300 mil","Fornecedores e experiência em gestão","Sou Convidado de Palestrante"],
  ["10/03/2026","Auditoria/Legal Tech","De R$ 2 milhões a R$ 5 milhões","Criar modelo de escalabilidade","Sou Diretor da Empresa"],
  ["10/03/2026","Serviços","Até R$ 300 mil","Todos","Sou Convidado de Palestrante"],
  ["10/03/2026","Tecnologia","Até R$ 300 mil","Gestão",""],
  ["10/03/2026","Tecnologia","Até R$ 300 mil","Gestão",""],
  ["10/03/2026","Tecnologia","Até R$ 300 mil","Network","Sou Convidado de Mentorado"],
  ["10/03/2026","Tecnologia","Até R$ 300 mil","Network","Sou Convidado de Mentorado"],
  ["10/03/2026","Tecnologia","Até R$ 300 mil","Network","Fogaça"],
  ["10/03/2026","Imobiliário","Até R$ 300 mil","Network","Sou Convidado de Mentorado"],
  ["10/03/2026","Tecnologia","Até R$ 300 mil","Acesso","Sou Convidado de Mentorado"],
  ["10/03/2026","Tecnologia","Até R$ 300 mil","Conexão","Sou Convidado de Mentorado"],
  ["10/03/2026","Tecnologia","Até R$ 300 mil","Acesso","Sou Convidado de Mentorado"],
  ["10/03/2026","Tecnologia","Até R$ 300 mil","Conexão","Sou Convidado de Mentorado"],
  ["10/03/2026","Tecnologia","Até R$ 300 mil","Conexão","Sou Convidado de Mentorado"],
  ["10/03/2026","Imobiliário","De R$ 300 mil a R$ 500 mil","Conexão","Sou Convidado de Mentorado"],
  ["10/03/2026","Serviços","Até R$ 300 mil","Todos","Sou Convidado de Palestrante"],
  ["10/03/2026","Tecnologia","Acima de R$ 10 milhões","Fortalecer marca","Sou Convidado de Palestrante"],
  ["10/03/2026","Tecnologia","Acima de R$ 10 milhões","Crescimento","Sou Convidado de Palestrante"],
  ["10/03/2026","Imobiliário","Até R$ 300 mil","Instabilidade","Sou Convidado de Mentorado"],
  ["10/03/2026","Tecnologia","Até R$ 300 mil","Mercado financeiro","Convidado"],
  ["10/03/2026","Tecnologia","Até R$ 300 mil","Gestão","Sou Convidado de Mentorado"],
  ["10/03/2026","Tecnologia","Até R$ 300 mil","Network","Sou Convidado de Mentorado"],
  ["10/03/2026","Tecnologia","Até R$ 300 mil","Network","Sou Convidado de Mentorado"],
  ["11/03/2026","Construção Civil","Até R$ 300 mil","Subir de Nível","Sou convidado da Equipe"],
  ["11/03/2026","Construção Civil","Até R$ 300 mil","Subir de Nível","Sou convidado da Equipe"],
  ["11/03/2026","Tecnologia","Acima de R$ 10 milhões","Sustentar o crescimento","Sou Convidado de Palestrante"],
  ["11/03/2026","Tecnologia","Acima de R$ 10 milhões","Integrar empresas","Sou Convidado de Palestrante"],
  ["11/03/2026","Serviços","De R$ 2 milhões a R$ 5 milhões","","Sou Convidado de Mentorado"],
  ["11/03/2026","Conteúdo/Unhas","Até R$ 300 mil","Alta carga de trabalho","Sou Convidado de Palestrante"],
  ["11/03/2026","Indústria","Acima de R$ 10 milhões","Rentabilidade",""],
  ["11/03/2026","Serviços","De R$ 500 mil a R$ 1 milhão","Gestão","Sou convidado da Equipe"],
  ["11/03/2026","Educação","Até R$ 300 mil","Vendas na internet","Sou convidado da Equipe"],
  ["11/03/2026","Educação/Entretenimento","De R$ 500 mil a R$ 1 milhão","Expansão","Sou Convidado de Palestrante"],
  ["11/03/2026","Saúde","De R$ 300 mil a R$ 500 mil","Mão de obra qualificada","Sou Convidado de Palestrante"],
  ["11/03/2026","Intermediação","De R$ 5 milhões a R$ 10 milhões","Capital de giro","Sou Convidado de Mentorado"],
  ["11/03/2026","Marketing","De R$ 500 mil a R$ 1 milhão","Delegação e organização de horários","Sou Convidado de Palestrante"],
  ["11/03/2026","Imobiliário","Até R$ 300 mil","Conclusão","Convidada"],
  ["11/03/2026","Imobiliário","De R$ 300 mil a R$ 500 mil","Mão de obra","Sou Convidado de Mentorado"],
  ["11/03/2026","Serviços","De R$ 1 milhão a R$ 2 milhões","","Sou Convidado de Palestrante"],
  ["11/03/2026","Serviços","De R$ 1 milhão a R$ 2 milhões","","Sou Convidado de Palestrante"],
  ["11/03/2026","Imobiliário","De R$ 300 mil a R$ 500 mil","Leads","Convidado"],
  ["11/03/2026","Imobiliário","Acima de R$ 10 milhões","Competição","Convidado"],
  ["11/03/2026","Indústria","Acima de R$ 10 milhões","Comercial","Sou convidado da Equipe"],
  ["11/03/2026","Construção Civil","De R$ 2 milhões a R$ 5 milhões","Crescimento","Sou Convidado de Palestrante"],
  ["11/03/2026","Construção Civil","De R$ 2 milhões a R$ 5 milhões","Captação de Recursos","Sou Convidado de Mentorado"],
  ["11/03/2026","Móveis/Decoração","De R$ 500 mil a R$ 1 milhão","Expandir parcerias","Sou convidado da Equipe"],
  ["11/03/2026","Barbearia","Até R$ 300 mil","Posicionamento","Sou Convidado de Mentorado"],
  ["11/03/2026","Serviços","Até R$ 300 mil","Organização em geral","Sou convidado da Equipe"],
  ["11/03/2026","Tecnologia","De R$ 500 mil a R$ 1 milhão","Crescimento","Sou convidado da Equipe"],
  ["11/03/2026","Marketing","De R$ 300 mil a R$ 500 mil","Crescimento de vendas","Sou Convidado de Mentorado"],
  ["11/03/2026","Tecnologia","Até R$ 300 mil","Escala","Sou Convidado de Mentorado"],
  ["11/03/2026","Ecommerce","Acima de R$ 10 milhões","Logística","Sou Convidado de Palestrante"],
  ["11/03/2026","Serviços","Até R$ 300 mil","Deixar o operacional","Convite de mentorado"],
  ["11/03/2026","Ecommerce","Acima de R$ 10 milhões","Logística","Sou Convidado de Palestrante"],
  ["11/03/2026","Serviços","De R$ 1 milhão a R$ 2 milhões","Aumentar esteira de produtos","Sou Mentorado"],
  ["11/03/2026","Tecnologia","Até R$ 300 mil","Escala","Sou convidado da Equipe"],
  ["11/03/2026","Construção Civil","Até R$ 300 mil","Novas parcerias","Convidado"],
  ["11/03/2026","Indústria","Acima de R$ 10 milhões","Busca de oportunidades","Sou Convidado de Mentorado"],
  ["11/03/2026","Imobiliário","Acima de R$ 10 milhões","Network","Sou Convidado de Mentorado"],
  ["11/03/2026","Saúde","Até R$ 300 mil","Estruturação de produtos","Sou convidado da Equipe"],
  ["11/03/2026","Serviços","Até R$ 300 mil","Manter receita recorrente",""],
  ["11/03/2026","Higienização/Impermeabilização","Até R$ 300 mil","Captação de clientes de alto nível","Sou Convidado de Mentorado"],
  ["11/03/2026","Beleza","Até R$ 300 mil","Contratar para crescimento","Sou Convidado de Mentorado"],
  ["11/03/2026","Imobiliário","Até R$ 300 mil","Prospecção","Sou Convidado da Última Edição"],
  ["11/03/2026","Imobiliário","Até R$ 300 mil","Prospecção de Novos clientes","Sou Convidado da Última Edição"],
  ["11/03/2026","Saúde","Até R$ 300 mil","Custo alto do serviço mental","Sou Convidado de Palestrante"],
  ["11/03/2026","Tecnologia","Até R$ 300 mil","Estratégia e posicionamento","Sou convidado da Equipe"],
  ["11/03/2026","Educação","Até R$ 300 mil","Capital","Comprei o ingresso"],
  ["11/03/2026","Tecnologia","De R$ 300 mil a R$ 500 mil","Mão de obra","Sou Convidado de Mentorado"],
  ["11/03/2026","Imobiliário","Até R$ 300 mil","Conclusão","Convidada"],
  ["11/03/2026","Marketing","Até R$ 300 mil","Estrutura Comercial","Sou Convidado de Mentorado"],
  ["11/03/2026","Construção Civil","De R$ 500 mil a R$ 1 milhão","Novas oportunidades",""],
  ["11/03/2026","Construção Civil","De R$ 2 milhões a R$ 5 milhões","Captação de Recursos","Sou Convidado de Mentorado"],
  ["11/03/2026","Serviços","De R$ 500 mil a R$ 1 milhão","Gestão de pessoas e liderança",""],
  ["11/03/2026","Serviços","Até R$ 300 mil","Gestão e organizações empresarial","Sou conselheiro"],
  ["11/03/2026","Serviços","Até R$ 300 mil","Gestão e organização","Sou convidado da Equipe"],
  ["11/03/2026","Tecnologia","Até R$ 300 mil","Faturamento",""],
  ["11/03/2026","Barbearia","Acima de R$ 10 milhões","Crescimento","Sou Convidado de Mentorado"],
  ["11/03/2026","Tecnologia","Até R$ 300 mil","Aumentar o faturamento","Sou Convidado de Mentorado"],
  ["11/03/2026","Educação","Até R$ 300 mil","Escalar","Sou Convidado de Mentorado"],
  ["11/03/2026","Imobiliário","Acima de R$ 10 milhões","Leads para investir no exterior","Convidados"],
  ["11/03/2026","Tecnologia","Até R$ 300 mil","Comercial","Sou conselheiro"],
];

// ─── DATA PROCESSING ───────────────────────────────────────────────────────
function processData(raw) {
  // Remove test/empty rows
  const data = raw.filter(r => r[1] && !["Teste","teste"].includes(r[2]) && r[0]);

  const total = data.length;

  // Revenue distribution
  const revMap = {};
  data.forEach(r => {
    const rev = r[2] || "Não informado";
    revMap[rev] = (revMap[rev] || 0) + 1;
  });
  const revOrder = [
    "Até R$ 300 mil",
    "De R$ 300 mil a R$ 500 mil",
    "De R$ 500 mil a R$ 1 milhão",
    "De R$ 1 milhão a R$ 2 milhões",
    "De R$ 2 milhões a R$ 5 milhões",
    "De R$ 5 milhões a R$ 10 milhões",
    "Acima de R$ 10 milhões",
  ];
  const revData = revOrder.map(k => ({ faixa: k.replace("De R$ ","R$ ").replace("Até R$ ","≤ R$ ").replace("Acima de R$ ","＋R$ "), count: revMap[k] || 0, full: k }));

  // Weighted avg revenue (midpoints in R$ thousands)
  const midpoints = {
    "Até R$ 300 mil": 150,
    "De R$ 300 mil a R$ 500 mil": 400,
    "De R$ 500 mil a R$ 1 milhão": 750,
    "De R$ 1 milhão a R$ 2 milhões": 1500,
    "De R$ 2 milhões a R$ 5 milhões": 3500,
    "De R$ 5 milhões a R$ 10 milhões": 7500,
    "Acima de R$ 10 milhões": 15000,
  };
  let totalRevenue = 0;
  data.forEach(r => { totalRevenue += (midpoints[r[2]] || 0); });
  const avgRevenue = totalRevenue / total;

  // Sector grouping
  const sectorMap = {
    "Tecnologia": 0, "Serviços": 0, "Imobiliário": 0, "Construção Civil": 0,
    "Educação": 0, "Saúde": 0, "Varejo": 0, "Indústria": 0,
    "Marketing": 0, "Outros": 0,
  };
  const sectorAliases = {
    "Tecnologia": ["Tecnologia","Marketing Digital","Digital","TechAG","Auditoria/Legal Tech","Financeiro","Mercado Financeiro","Investimentos"],
    "Serviços": ["Serviços","Advocacia","Jurídico","Representação Comercial","Intermediação","Arquitetura","Higienização/Impermeabilização"],
    "Imobiliário": ["Imobiliário","Marketing Imobiliário"],
    "Construção Civil": ["Construção Civil"],
    "Educação": ["Educação","Educação/Entretenimento"],
    "Saúde": ["Saúde"],
    "Varejo": ["Varejo","Comércio","Automóveis","Máquinas/Café","Joalheria","Barbearia","Beleza","Ecommerce","Alimentação","Alimentício"],
    "Indústria": ["Indústria"],
    "Marketing": ["Marketing","Eventos"],
    "Outros": ["Agropecuária","Telecomunicação","Franquia","Seguros","Fast food","Conteúdo/Unhas","Móveis/Decoração","Vendas","Outros"],
  };
  data.forEach(r => {
    const sec = r[1] || "";
    let found = false;
    for (const [group, aliases] of Object.entries(sectorAliases)) {
      if (aliases.some(a => sec.toLowerCase().includes(a.toLowerCase()))) {
        sectorMap[group]++;
        found = true;
        break;
      }
    }
    if (!found) sectorMap["Outros"]++;
  });
  const sectorData = Object.entries(sectorMap)
    .filter(([,v]) => v > 0)
    .sort((a,b) => b[1]-a[1])
    .map(([name, value]) => ({ name, value }));

  // Pain points / challenges
  const painKeywords = {
    "Vendas / Captação": ["vend","capt","prospect","lead","clientes","comercial","demanda"],
    "Escala / Crescimento": ["escal","crescim","alavanc","expans","subir","exponenci"],
    "Gestão / Processos": ["gest","process","organiz","estrutur","administr","fluxo"],
    "Mão de Obra / Equipe": ["mão de obra","equipe","colaborad","contrat","pessoal","time"],
    "Faturamento / Financeiro": ["faturamento","financei","capital","caixa","investim","receita","imposto"],
    "Networking / Visibilidade": ["network","connect","visibilid","posicion","autoridad","marca"],
  };
  const painCount = Object.fromEntries(Object.keys(painKeywords).map(k => [k, 0]));
  data.forEach(r => {
    const challenge = (r[3] || "").toLowerCase();
    for (const [pain, kws] of Object.entries(painKeywords)) {
      if (kws.some(kw => challenge.includes(kw))) {
        painCount[pain]++;
        break;
      }
    }
  });
  const painData = Object.entries(painCount).sort((a,b) => b[1]-a[1]).map(([name,count]) => ({ name, count }));

  // Invite type
  const inviteMap = {};
  data.forEach(r => {
    let inv = r[4] || "Não informado";
    if (inv.includes("Mentorado")) inv = "Mentorado";
    else if (inv.includes("Equipe")) inv = "Equipe";
    else if (inv.includes("Palestrante")) inv = "Palestrante";
    else if (inv.includes("conselheiro")) inv = "Conselheiro";
    else if (inv.includes("Última Edição")) inv = "Edição Anterior";
    else if (inv.includes("Amigo") || inv.includes("amigo") || inv.includes("Convidado por")) inv = "Amigo/Indicação";
    else if (inv.includes("Instagram") || inv.includes("rede social")) inv = "Redes Sociais";
    else inv = "Outros";
    inviteMap[inv] = (inviteMap[inv] || 0) + 1;
  });
  const inviteData = Object.entries(inviteMap).sort((a,b)=>b[1]-a[1]).map(([name,value]) => ({name, value}));

  // Registration timeline by date
  const dateMap = {};
  data.forEach(r => {
    const d = r[0];
    dateMap[d] = (dateMap[d] || 0) + 1;
  });
  const allDates = Object.keys(dateMap).sort((a,b) => {
    const pa = a.split("/"); const pb = b.split("/");
    return new Date(pa[2],pa[1]-1,pa[0]) - new Date(pb[2],pb[1]-1,pb[0]);
  });
  let cum = 0;
  const timelineData = allDates.map(d => {
    cum += dateMap[d];
    const [dd,mm] = d.split("/");
    return { dia: `${dd}/${mm}`, novos: dateMap[d], acumulado: cum };
  });

  // Top pains above 10M
  const bigPlayers = data.filter(r => r[2] === "Acima de R$ 10 milhões");

  return { total, revData, avgRevenue, sectorData, painData, inviteData, timelineData, bigPlayers, totalRevenue };
}

const GOLD = "#C9A84C";
const GOLD2 = "#E8C97A";
const DARK = "#0C0A06";
const CARD = "#131009";
const BORDER = "#271E09";
const SECTOR_COLORS = ["#C9A84C","#A07838","#E8C97A","#8B6518","#F5E4A0","#6B4D14","#D4A850","#9A7030","#B88C3C","#7A5C22"];

const fmt = (n) => n >= 1e6 ? `R$ ${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `R$ ${(n/1e3).toFixed(0)}K` : `R$ ${n}`;

function AnimNum({ target, prefix="", suffix="", duration=1200 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return <span>{prefix}{val.toLocaleString("pt-BR")}{suffix}</span>;
}

function KPI({ icon, label, value, sub, accent = GOLD, delay = 0 }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.55s cubic-bezier(.16,1,.3,1)",
      background: "linear-gradient(145deg,#171209,#1F1608)", border: `1px solid ${BORDER}`,
      borderTop: `2px solid ${accent}`, borderRadius: 14, padding: "22px 24px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position:"absolute",top:-20,right:-20,width:90,height:90,background:`radial-gradient(circle,${accent}18 0%,transparent 70%)`,borderRadius:"50%" }}/>
      <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize: 30, fontWeight: 800, color: accent, lineHeight:1, marginBottom: 5 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#8B7050", letterSpacing:"0.09em", textTransform:"uppercase", fontWeight:600 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: "#5A4020", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#1A1208", border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 14px" }}>
      <div style={{ color: GOLD2, fontSize:12, fontWeight:600, marginBottom:4 }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ color:"#A07030", fontSize:11 }}>{p.name}: <span style={{color:GOLD}}>{p.value}</span></div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const d = processData(RAW);
  const [tab, setTab] = useState("overview");

  const topSector = d.sectorData[0];
  const topPain = d.painData[0];
  const _topInvite = d.inviteData[0];
  const pctSmall = d.revData[0] ? Math.round((d.revData[0].count / d.total) * 100) : 0;

  return (
    <div style={{ minHeight:"100vh", background: DARK, fontFamily:"'DM Sans','Segoe UI',sans-serif", color:"#D4B896" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:5px } ::-webkit-scrollbar-thumb { background:#2A1F08; border-radius:3px }
        .tab { cursor:pointer; padding:8px 18px; border-radius:8px; font-size:12px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; border:none; transition:all .2s; }
      `}</style>

      {/* HEADER */}
      <div style={{ background:"linear-gradient(90deg,#0C0A06,#1A1208,#0C0A06)", borderBottom:`1px solid ${BORDER}`, padding:"18px 36px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:38, height:38, background:`linear-gradient(135deg,${GOLD},#7A5010)`, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:`0 0 18px ${GOLD}40` }}>◆</div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:800, color:GOLD2, letterSpacing:"-0.02em" }}>ENCONTRO DE NEGÓCIOS</div>
            <div style={{ fontSize:10, color:"#5A4020", letterSpacing:".12em", textTransform:"uppercase" }}>Dashboard Executivo · Antônio Fogaça & Pablo Marçal</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {["overview","faturamento","setores","dores","timeline"].map(t => (
            <button key={t} className="tab" onClick={() => setTab(t)} style={{
              background: tab===t ? `linear-gradient(135deg,${GOLD},#8B6014)` : "transparent",
              color: tab===t ? "#0C0A06" : "#8B7050",
              border: tab===t ? "none" : `1px solid ${BORDER}`,
            }}>
              {t==="overview"?"Visão Geral":t==="faturamento"?"Faturamento":t==="setores"?"Setores":t==="dores"?"Dores":t==="timeline"?"Timeline":""}
            </button>
          ))}
        </div>
        <div style={{ textAlign:"right", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
          <a href="/dash-edn6/compradores.html" style={{ fontSize:11, color:GOLD, textDecoration:"none", border:`1px solid ${GOLD}`, padding:"4px 8px", borderRadius:4 }}>Ver Compradores</a>
          <div style={{ fontSize:11, color:"#5A4020" }}>{new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"})}</div>
          <div style={{ fontSize:9, color:"#3A2A10", letterSpacing:".1em" }}>CONFIDENCIAL</div>
        </div>
      </div>

      <div style={{ padding:"28px 36px", maxWidth:1360, margin:"0 auto" }}>

        {/* NICHO BANNER */}
        <div style={{
          background:"linear-gradient(135deg,#191208,#231A0A)", border:`1px solid #3A2A0A`,
          borderRadius:18, padding:"24px 32px", marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between", position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute",top:-30,right:-30,width:180,height:180,background:`radial-gradient(circle,${GOLD}20 0%,transparent 70%)`,borderRadius:"50%" }}/>
          <div style={{ position:"absolute",bottom:-20,left:300,width:120,height:120,background:`radial-gradient(circle,${GOLD}10 0%,transparent 70%)`,borderRadius:"50%" }}/>
          <div>
            <div style={{ fontSize:10, color:"#5A4020", letterSpacing:".14em", textTransform:"uppercase", marginBottom:6 }}>Nicho / Evento</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:34, fontWeight:900, color:GOLD, letterSpacing:"-0.02em", lineHeight:1 }}>
              Ecossistema de Negócios
            </div>
            <div style={{ color:"#8B7050", fontSize:14, marginTop:8, maxWidth:520 }}>
              Pré-qualificação de participantes do <strong style={{color:GOLD2}}>Encontro de Negócios com Antônio Fogaça e Pablo Marçal</strong> — empresários e empreendedores em busca de escala, networking e aceleração de resultados
            </div>
          </div>
          <div style={{ display:"flex", gap:12, flexShrink:0 }}>
            {[
              { label:"Total inscritos", val: d.total, icon:"👥" },
              { label:"Faturamento médio", val: fmt(d.avgRevenue * 1000), icon:"📊" },
              { label:"Nicho dominante", val: topSector?.name, icon:"🏆" },
            ].map((item,i) => (
              <div key={i} style={{ background:"#0C0A0680", border:`1px solid ${BORDER}`, borderRadius:12, padding:"16px 20px", textAlign:"center", minWidth:130 }}>
                <div style={{ fontSize:20 }}>{item.icon}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:GOLD, fontWeight:700, marginTop:4 }}>{item.val}</div>
                <div style={{ fontSize:10, color:"#5A4020", letterSpacing:".08em", marginTop:2 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <>
            {/* KPI CARDS */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
              <KPI icon="👥" label="Inscritos Confirmados" value={<AnimNum target={d.total} />} sub={`Em ${[...new Set(RAW.map(r=>r[0]))].length} dias de captação`} delay={0} />
              <KPI icon="💰" label="Faturamento Médio" value={fmt(d.avgRevenue*1000)} sub="Estimado por faixa declarada" delay={100} accent={GOLD2} />
              <KPI icon="🏗️" label="Setor Dominante" value={topSector?.name} sub={`${topSector?.value} inscritos (${Math.round(topSector?.value/d.total*100)}%)`} delay={200} />
              <KPI icon="🔥" label="Principal Dor" value={topPain?.name.split(" ")[0]} sub={`${topPain?.count} relatos — ${topPain?.name}`} delay={300} accent="#E87050" />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
              <KPI icon="🎯" label="Micro Empresas (≤300K)" value={`${pctSmall}%`} sub={`${d.revData[0]?.count} participantes`} delay={100} accent="#F5C040" />
              <KPI icon="🦁" label="Grandes Empresas (10M+)" value={`${d.bigPlayers.length}`} sub="Acima de R$ 10 milhões" delay={200} accent={GOLD2} />
              <KPI icon="🤝" label="Via Mentorado" value={`${d.inviteData.find(i=>i.name==="Mentorado")?.value || 0}`} sub="Principal canal de captação" delay={300} />
              <KPI icon="📍" label="Via Equipe" value={`${d.inviteData.find(i=>i.name==="Equipe")?.value || 0}`} sub="Convidados pela equipe" delay={400} accent={GOLD2} />
            </div>

            {/* CHARTS ROW */}
            <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:18, marginBottom:18 }}>
              {/* Revenue bar */}
              <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:"22px 24px" }}>
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:10, color:"#5A4020", letterSpacing:".12em", textTransform:"uppercase", marginBottom:3 }}>Distribuição de Faturamento</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:GOLD }}>Volume por Faixa de Receita</div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={d.revData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A150A" horizontal={false}/>
                    <XAxis type="number" tick={{fill:"#5A4020",fontSize:10}} axisLine={false} tickLine={false}/>
                    <YAxis dataKey="faixa" type="category" tick={{fill:"#8B7050",fontSize:10}} width={100} axisLine={false} tickLine={false}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Bar dataKey="count" name="Inscritos" radius={[0,4,4,0]}>
                      {d.revData.map((_,i) => <Cell key={i} fill={i===0?"#8B6018":GOLD} fillOpacity={i===0?0.7:0.9}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Sector pie */}
              <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:"22px 24px" }}>
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:10, color:"#5A4020", letterSpacing:".12em", textTransform:"uppercase", marginBottom:3 }}>Segmentação</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:GOLD }}>Setores de Atuação</div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={d.sectorData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2}>
                      {d.sectorData.map((_,i) => <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]}/>)}
                    </Pie>
                    <Tooltip contentStyle={{background:"#1A1208",border:`1px solid ${BORDER}`,borderRadius:8,color:GOLD,fontSize:12}}/>
                    <Legend iconSize={8} wrapperStyle={{fontSize:10,color:"#8B7050"}}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* INVITE TYPE + PAINS */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
              <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:"22px 24px" }}>
                <div style={{ fontSize:10, color:"#5A4020", letterSpacing:".12em", textTransform:"uppercase", marginBottom:3 }}>Canal de Aquisição</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:GOLD, marginBottom:16 }}>Como Foram Convidados</div>
                {d.inviteData.map((item,i) => (
                  <div key={i} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:12, color:"#A09070" }}>{item.name}</span>
                      <span style={{ fontSize:12, color:GOLD, fontWeight:600 }}>{item.value}</span>
                    </div>
                    <div style={{ height:5, background:"#1A150A", borderRadius:3 }}>
                      <div style={{ height:5, width:`${(item.value/d.inviteData[0].value)*100}%`, background:`linear-gradient(90deg,${GOLD},#8B6014)`, borderRadius:3, transition:"width .8s ease" }}/>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:"22px 24px" }}>
                <div style={{ fontSize:10, color:"#5A4020", letterSpacing:".12em", textTransform:"uppercase", marginBottom:3 }}>Diagnóstico</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"#E87060", marginBottom:16 }}>Principais Dores do Negócio</div>
                {d.painData.map((item,i) => {
                  const colors = ["#F87171","#FBBF24","#C9A84C","#A07038","#8B6018","#6B4810"];
                  return (
                    <div key={i} style={{ marginBottom:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:12, color:"#A09070" }}>{item.name}</span>
                        <span style={{ fontSize:12, color:colors[i], fontWeight:600 }}>{item.count}</span>
                      </div>
                      <div style={{ height:5, background:"#1A150A", borderRadius:3 }}>
                        <div style={{ height:5, width:`${(item.count/d.painData[0].count)*100}%`, background:colors[i], borderRadius:3, opacity:.8, transition:"width .8s ease" }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* FATURAMENTO TAB */}
        {tab === "faturamento" && (
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
              <KPI icon="📈" label="Faturamento Médio Estimado" value={fmt(d.avgRevenue*1000)} sub="Média ponderada por faixa" delay={0}/>
              <KPI icon="💼" label="Ticket Potencial (10M+)" value={`${d.bigPlayers.length} empresas`} sub="Acima de R$ 10 milhões/ano" delay={100} accent={GOLD2}/>
              <KPI icon="🏢" label="Faixa Mais Comum" value="≤ R$ 300K" sub={`${d.revData[0]?.count} inscritos — ${pctSmall}% do total`} delay={200} accent="#F5C040"/>
            </div>
            <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:"24px 28px" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:GOLD, marginBottom:20 }}>Distribuição Completa por Faixa de Faturamento</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={d.revData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A150A" vertical={false}/>
                  <XAxis dataKey="faixa" tick={{fill:"#5A4020",fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#5A4020",fontSize:11}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Bar dataKey="count" name="Inscritos" radius={[5,5,0,0]}>
                    {d.revData.map((_,i) => <Cell key={i} fill={SECTOR_COLORS[i]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:"24px 28px" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:GOLD, marginBottom:16 }}>Empresas com Faturamento Acima de R$ 10M</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                {d.bigPlayers.map((p,i) => (
                  <div key={i} style={{ background:"#0C0A06", border:`1px solid ${BORDER}`, borderRadius:10, padding:"12px 16px" }}>
                    <div style={{ fontSize:10, color:GOLD, letterSpacing:".08em", textTransform:"uppercase", marginBottom:4 }}>{p[1]}</div>
                    <div style={{ fontSize:11, color:"#8B7050" }}>Desafio: {p[3] || "Não informado"}</div>
                    <div style={{ fontSize:10, color:"#5A4020", marginTop:4 }}>{p[4] || "—"}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SETORES TAB */}
        {tab === "setores" && (
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:18 }}>
              <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:"24px 28px" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:GOLD, marginBottom:20 }}>Ranking de Setores</div>
                {d.sectorData.map((item,i) => (
                  <div key={i} style={{ marginBottom:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:10, height:10, borderRadius:2, background:SECTOR_COLORS[i] }}/>
                        <span style={{ fontSize:13, color:"#A09070", fontWeight:500 }}>{item.name}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:11, color:"#5A4020" }}>{Math.round(item.value/d.total*100)}%</span>
                        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:SECTOR_COLORS[i], fontWeight:700 }}>{item.value}</span>
                      </div>
                    </div>
                    <div style={{ height:6, background:"#1A150A", borderRadius:3 }}>
                      <div style={{ height:6, width:`${(item.value/d.sectorData[0].value)*100}%`, background:SECTOR_COLORS[i], borderRadius:3, opacity:.85 }}/>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:"24px 28px" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:GOLD, marginBottom:12 }}>Setores por Participação</div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={d.sectorData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} innerRadius={50} paddingAngle={2} label={({name,percent}) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={{stroke:"#3A2A0A"}} fontSize={10}>
                      {d.sectorData.map((_,i) => <Cell key={i} fill={SECTOR_COLORS[i]}/>)}
                    </Pie>
                    <Tooltip contentStyle={{background:"#1A1208",border:`1px solid ${BORDER}`,borderRadius:8,color:GOLD,fontSize:12}}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Insight box */}
            <div style={{ background:`linear-gradient(135deg,#191208,#231A0A)`, border:`1px solid #3A2A0A`, borderRadius:14, padding:"20px 28px", display:"flex", gap:20 }}>
              <div style={{ fontSize:10, color:"#5A4020", letterSpacing:".12em", textTransform:"uppercase", flexShrink:0, paddingTop:3 }}>⚡ INSIGHT</div>
              <div style={{ fontSize:13, color:"#C0A060", lineHeight:1.7, fontStyle:"italic" }}>
                <strong style={{color:GOLD}}>Tecnologia</strong> e <strong style={{color:GOLD}}>Serviços</strong> lideram o evento com empresários focados em escala digital. 
                O setor <strong style={{color:GOLD}}>Imobiliário</strong> representa a 3ª maior concentração, sinalizando forte demanda por estruturação e captação no setor. 
                Destaque para <strong style={{color:GOLD}}>Construção Civil</strong> como quarto maior setor, com participantes buscando gestão e escala operacional.
              </div>
            </div>
          </div>
        )}

        {/* DORES TAB */}
        {tab === "dores" && (
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div style={{ background:CARD, border:"1px solid #3A1A0A", borderRadius:14, padding:"24px 28px" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#E87060", marginBottom:20 }}>Mapeamento Completo de Dores</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={d.painData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A150A" vertical={false}/>
                  <XAxis dataKey="name" tick={{fill:"#5A4020",fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#5A4020",fontSize:11}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Bar dataKey="count" name="Ocorrências" radius={[5,5,0,0]}>
                    {d.painData.map((_,i) => <Cell key={i} fill={["#F87171","#FBBF24","#C9A84C","#A07038","#8B6018","#6B4810"][i]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
              {d.painData.map((p,i) => {
                const colors = ["#F87171","#FBBF24","#C9A84C","#A07038","#8B6018","#6B4810"];
                const sev = i===0?"CRÍTICA":i===1?"ALTA":i===2?"ALTA":"MÉDIA";
                const sevColor = i===0?"#F87171":i<=2?"#FBBF24":"#C9A84C";
                const descriptions = {
                  "Vendas / Captação":"Dificuldade em atrair e converter clientes qualificados. Falta de processos comerciais estruturados e previsibilidade no pipeline.",
                  "Escala / Crescimento":"Incapacidade de crescer sem aumentar proporcionalmente custos e complexidade operacional.",
                  "Gestão / Processos":"Ausência de processos padronizados, gestão do tempo, delegação e indicadores de desempenho.",
                  "Mão de Obra / Equipe":"Dificuldade em contratar, capacitar e reter profissionais alinhados com a cultura e objetivos.",
                  "Faturamento / Financeiro":"Falta de previsibilidade financeira, capital de giro, e controle do fluxo de caixa.",
                  "Networking / Visibilidade":"Ausência de posicionamento de mercado e conexões estratégicas que gerem oportunidades.",
                };
                return (
                  <div key={i} style={{ background:CARD, border:`1px solid ${BORDER}`, borderLeft:`3px solid ${colors[i]}`, borderRadius:"0 12px 12px 0", padding:"18px 20px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:GOLD2 }}>{p.name.split(" ")[0]}</span>
                      <span style={{ fontSize:9, fontWeight:800, letterSpacing:".1em", color:sevColor, background:`${sevColor}18`, border:`1px solid ${sevColor}40`, borderRadius:4, padding:"2px 6px" }}>{sev}</span>
                    </div>
                    <div style={{ fontSize:11, color:"#6B5A3A", lineHeight:1.6, marginBottom:8 }}>{descriptions[p.name]}</div>
                    <div style={{ fontSize:22, fontWeight:800, color:colors[i], fontFamily:"'Playfair Display',serif" }}>{p.count} <span style={{fontSize:11, color:"#5A4020", fontWeight:400, fontFamily:"sans-serif"}}>relatos</span></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TIMELINE TAB */}
        {tab === "timeline" && (
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
              <KPI icon="📅" label="Período de Captação" value="20 dias" sub="18/02/2026 a 11/03/2026" delay={0}/>
              <KPI icon="📈" label="Pico de Inscrições" value="11/Mar" sub={`${Math.max(...d.timelineData.map(t=>t.novos))} inscrições em 1 dia`} delay={100} accent={GOLD2}/>
              <KPI icon="⚡" label="Média Diária" value={(d.total / d.timelineData.length).toFixed(1)} sub="Inscrições por dia" delay={200}/>
            </div>
            <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:"24px 28px" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:GOLD, marginBottom:20 }}>Crescimento Acumulado de Inscrições</div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={d.timelineData}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={GOLD} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={GOLD} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A150A"/>
                  <XAxis dataKey="dia" tick={{fill:"#5A4020",fontSize:9}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#5A4020",fontSize:11}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Area type="monotone" dataKey="acumulado" name="Total acumulado" stroke={GOLD} strokeWidth={2.5} fill="url(#areaGrad)" dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:"24px 28px" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:GOLD, marginBottom:16 }}>Inscrições por Dia</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={d.timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A150A" vertical={false}/>
                  <XAxis dataKey="dia" tick={{fill:"#5A4020",fontSize:9}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#5A4020",fontSize:11}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Bar dataKey="novos" name="Novos inscritos" fill={GOLD} radius={[4,4,0,0]} opacity={0.85}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div style={{ textAlign:"center", padding:"28px 0 12px", borderTop:`1px solid ${BORDER}`, marginTop:24 }}>
          <div style={{ fontSize:10, color:"#3A2A10", letterSpacing:".1em" }}>
            DOCUMENTO CONFIDENCIAL · Encontro de Negócios — Antônio Fogaça & Pablo Marçal · Dados reais da planilha de pré-qualificação · {new Date().toLocaleDateString("pt-BR")}
          </div>
        </div>
      </div>
    </div>
  );
}
