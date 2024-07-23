#include <stdio.h>
#include <ctype.h>

int main() {
    char opcao, alternativa;

    printf("\n Explicando como funciona:\n\n");
    printf("voce vai escolher uma opcao e recebera um link de acordo com o que voce escolher ai eh so vc clicar no link copiar e colar no seu navegador.\n");
    printf("REGRA: so eh permitido escolher duas vezes. pense bem antes de escolher.\n");
    printf("\npreparada? digite 's' para sim e 'n' para nao.\n");
    scanf(" %c", &alternativa);  // Corrigido para evitar problema de buffer

    alternativa = toupper(alternativa);

    if (alternativa == 'S') {
        printf("\n > > > terminal elloisis < < < \n");
        printf("escolha uma das opcoes:\n");
        printf("M- musica para voce\n");
        printf("T- texto para voce\n");
        printf("A- audio para voce\n");
        printf("V- ver video curto para voce\n");
        printf("S- sair \n");
        scanf(" %c", &opcao);  // Corrigido para evitar problema de buffer
        opcao = toupper(opcao);

        switch (opcao) {
            case 'M':
                printf("https://www.youtube.com/watch?v=yQBV6hjCA2U\n");
                break;
                
            case 'T':
                printf("https://docs.google.com/document/d/1Tdpw96TmeMSeJXeUnnv-FXkC4vykvBF51gvxsE5Aqug/edit?usp=sharing\n");
                break;
                
            case 'A':
                printf("https://drive.google.com/file/d/1X2h1bFJ7Jcq-mM8_qDw9ezK7NPj1dwRg/view?usp=drivesdk\n");
                break;
            case 'V':
                printf("https://youtu.be/F6gC2bxXTPM?si=uE_BzimPy-gLBZcN\n");
                break;
                
            case 'S':
                printf("Saindo...\n");
                break;
            default:
                printf("Opção inválida!\n");
        }
    } else {
        printf("Quando estiver pronta, avise entao.\n");
    }

    return 0;
}
