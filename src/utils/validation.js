
class validation {

    static required(value, msg) {

        value = String(value)
        if (!value || (value && (value).trim() == '') || value == 'undefined') throw msg

    }

    static email(value, msg) {

        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(String(value).toLowerCase())) return true
        else throw msg

    }

    static phone(value, msg) {
        var regex = new RegExp(/^\([0-9]{2}\) [0-9]?[0-9]{4}-[0-9]{4}$/);
        if (regex.test(value)) return true
        else throw msg

    }


    /**
     * @description códido de validação de cpf usado na internet
     * @link https://www.geradorcpf.com/javascript-validar-cpf.htm
     */
    static cpf(cpf, msg) {

        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf == '') throw msg;

        // Elimina CPFs invalidos conhecidos	
        if (cpf.length != 11 ||
            cpf == "00000000000" ||
            cpf == "11111111111" ||
            cpf == "22222222222" ||
            cpf == "33333333333" ||
            cpf == "44444444444" ||
            cpf == "55555555555" ||
            cpf == "66666666666" ||
            cpf == "77777777777" ||
            cpf == "88888888888" ||
            cpf == "99999999999")
            throw msg;
        // Valida 1o digito	
        let add = 0;
        for (let i = 0; i < 9; i++)
            add += parseInt(cpf.charAt(i)) * (10 - i);
        let rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpf.charAt(9)))
            throw msg;
        // Valida 2o digito	
        add = 0;
        for (let i = 0; i < 10; i++)
            add += parseInt(cpf.charAt(i)) * (11 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpf.charAt(10)))
            throw msg;
        return true;

    }


    /**
     * @description códido de validação de cnpj usado na internet
     * @link https://www.geradorcnpj.com/javascript-validar-cnpj.htm
     */

     static cnpj(cnpj, msg) {
        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj == '') throw msg;

        if (cnpj.length != 14)
            throw msg;

        // Elimina CNPJs invalidos conhecidos
        if (cnpj == "00000000000000" ||
            cnpj == "11111111111111" ||
            cnpj == "22222222222222" ||
            cnpj == "33333333333333" ||
            cnpj == "44444444444444" ||
            cnpj == "55555555555555" ||
            cnpj == "66666666666666" ||
            cnpj == "77777777777777" ||
            cnpj == "88888888888888" ||
            cnpj == "99999999999999")
            throw msg;

        // Valida DVs
        let tamanho = cnpj.length - 2
        let numeros = cnpj.substring(0, tamanho);
        const digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
            throw msg;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
            throw msg;

        return true;

    }



    static isMatch(valueA, valueB, msg) {

        if (valueA === valueB) return true
        else throw msg

    }


    static date(value, msg) {

        const isValidDate = Date.parse(value);
        if (!isNaN(isValidDate)) return true
        else throw msg

    }


    static number(value, msg) {

        if (!isNaN(value)) return true
        else throw msg

    }

    static boolean(value, msg) {

        if (typeof value === 'boolean') return true
        else throw msg

    }


    static numberonly(value, msg) {

        const re = /^[0-9]*$/
        if (re.test(value)) return true
        else throw msg

    }


    static passwordStrength(value, msg) {

        const re = /^(?=(.*[a-z]){3,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/;
        if (re.test(value)) return true
        else throw msg


    }


}

module.exports = validation