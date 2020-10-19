// Import this named export into your test file:
export const mockAutoDetectRenderer = jest.fn();
export const mock = jest.fn().mockImplementation(() => {
    return {
        PIXI: {
            autoDetectRenderer: mockAutoDetectRenderer.mockReturnValue({
                view: {

                },
            })
        }
    };
});

export default mock;