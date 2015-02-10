/*global describe, it, expect*/

export default (getTestWindow) => {

    describe("ES6 Base", () => {

        it("tests should have accessible testWindow instance", () => {
            expect(getTestWindow()).toBeDefined();
        });

    });

};
