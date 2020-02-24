block('btn')({'tag': 'button'});

block('btn').match((node, ctx) => ctx.btnText)({
    content: (node, ctx) => [
        {
            elem: 'text',
            content: ctx.btnText,
        },
    ],
});
