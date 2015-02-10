/*global describe, it, expect*/

export default (getTestWindow, getModule) => {

    describe("Logger", () => {

        it("should have log and error methods", () => {
            let Logger = getModule("class/Logger");

            expect(Logger.log).toBeDefined();
            expect(Logger.error).toBeDefined();
        });

        it("log method should call console.log on window", () => {
            let Logger = getModule("class/Logger");

            let logged = null,
                testString = "a string message";
            getTestWindow().console.log = (arg) => { logged = arg; };
            Logger.log(testString);

            expect(logged).toBe(testString);
        });

        it("error method should call console.error on window", () => {
            let Logger = getModule("class/Logger");

            let logged = null,
                testString = "a string message";
            getTestWindow().console.error = (arg) => { logged = arg; };
            Logger.error(testString);

            expect(logged).toBe(testString);
        });

    });

};
