import {
  validateEmail,
  validateUsername,
  submitForm,
} from "./mini-project/validate.js";
describe("Validatejs", () => {
  describe("Валидация имени пользователя", () => {
    const fixtures = [
      { input: "Stas", expected: true },
      { input: "St", expected: false },
      { input: "Stas123", expected: false },
      { input: "#$#%^&", expected: false },
      { input: "Иванов", expected: true },
      { input: "Stas_Розель", expected: true },
    ];

    for (let i = 0; i < fixtures.length; i++) {
      const input = fixtures[i].input;
      const expected = fixtures[i].expected;
      it(`Введены данные ${input} и ожидаем результат ${expected}`, () => {
        assert.equal(validateUsername(input), expected);
      });
    }
  });

  describe("Валидация почты", () => {
    const fixtures = [
      { input: "Stas.rozel@gmail.com", expected: true },
      { input: "St@", expected: false },
      { input: "Stas@123", expected: false },
      { input: "Stas@%^&", expected: false },
      { input: "Иванов@mail.ru", expected: false },
      { input: "Stas_Розель@yandex.ru", expected: false },
    ];

    for (let i = 0; i < fixtures.length; i++) {
      const input = fixtures[i].input;
      const expected = fixtures[i].expected;
      it(`Введены данные ${input} и ожидаем результат ${expected}`, () => {
        assert.equal(validateEmail(input), expected);
      });
    }
  });
  describe("Проветка отправки формы", () => {
    it("По предусловию все поля заполнены верно", () => {
      assert.equal(submitForm(true, true, true, true), true);
    });
    it("По предусловию несколько полей заполнены не верно", () => {
      assert.equal(submitForm(true, true, true, true), false);
    });
  });
});

mocha.run();
