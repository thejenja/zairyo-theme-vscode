function resolve(palette, color, scheme) {
  if (!color) return null;
  if (scheme.tokenOverrides[color]) {
    return scheme.tokenOverrides[color];
  }
  if (color.startsWith('$')) {
    return palette[color.slice(1)];
  }
  return color;
}

function tc(name, scopes, fg, opts = {}) {
  const entry = { name, scope: Array.isArray(scopes) ? scopes : [scopes], settings: {} };
  if (fg) entry.settings.foreground = fg;
  if (opts.fontStyle) entry.settings.fontStyle = opts.fontStyle;
  return entry;
}

export function buildTokenColors(palette, scheme) {
  const fg = (color) => resolve(palette, color, scheme);
  const tk = (name, scopes, color, opts) => tc(name, scopes, fg(color), opts);

  return [
    // ── Comments ──
    tk('Comments', ['comment', 'punctuation.definition.comment'], '$outline', { fontStyle: 'italic' }),

    // ── Keywords ──
    tk('Keywords', ['keyword', 'keyword.control', 'storage.type', 'storage.modifier'], '$primary', { fontStyle: 'bold' }),

    // ── Strings ──
    tk('Strings', ['string', 'string.quoted', 'string.unquoted'], '$tertiary'),

    // ── Numbers ──
    tk('Numbers', ['constant.numeric'], '$error'),

    // ── Functions ──
    tk('Functions', ['entity.name.function', 'support.function', 'meta.function-call'], '$secondary'),

    // ── Types ──
    tk('Types', ['entity.name.type', 'support.type', 'storage.type'], '$onPrimaryContainer'),

    // ── Classes ──
    tk('Classes', ['entity.name.class', 'support.class'], '$onPrimaryContainer'),

    // ── Variables ──
    tk('Variables', ['variable', 'variable.other'], '$onSurface'),

    // ── Constants ──
    tk('Constants', ['constant', 'constant.language', 'variable.other.constant'], '$primary'),

    // ── Operators ──
    tk('Operators', ['keyword.operator'], '$onSurfaceVariant'),

    // ── Tags ──
    tk('Tags', ['entity.name.tag', 'meta.tag'], '$primary'),

    // ── Attributes ──
    tk('Attributes', ['entity.other.attribute-name'], '$secondary'),

    // ── Properties ──
    tk('Properties', ['variable.object', 'support.variable.property'], '$onSurface'),

    // ── Punctuation ──
    tk('Punctuation', ['punctuation', 'meta.brace'], '$onSurfaceVariant'),

    // ── Markup ──
    tk('Markup Headings', ['markup.heading'], '$primary', { fontStyle: 'bold' }),
    tk('Markup Bold', ['markup.bold'], null, { fontStyle: 'bold' }),
    tk('Markup Italic', ['markup.italic'], null, { fontStyle: 'italic' }),
    tk('Markup Links', ['markup.underline.link'], '$secondary'),
    tk('Markup Code', ['markup.inline.raw'], '$tertiary'),

    // ── Diff ──
    tk('Diff Inserted', ['markup.inserted'], '#A8DAB5'),
    tk('Diff Deleted', ['markup.deleted'], '$error'),
    tk('Diff Changed', ['markup.changed'], '$primary'),

    // ── Language-specific: YAML ──
    tk('YAML Keys', ['entity.name.tag.yaml'], '$primary'),

    // ── Language-specific: JSON ──
    tk('JSON Keys', ['support.type.property-name.json'], '$secondary'),

    // ── Language-specific: CSS ──
    tk('CSS Property Names', ['support.type.property-name.css'], '$primary'),
    tk('CSS Property Values', ['support.constant.property-value.css'], '$tertiary'),
    tk('CSS Selectors', ['entity.name.tag.css', 'entity.other.attribute-name'], '$error'),

    // ── Language-specific: Python ──
    tk('Python Function Definitions', ['entity.name.function.python'], '$secondary'),
    tk('Python Self', ['variable.language.self.python'], '$onSurface'),

    // ── Language-specific: JavaScript / TypeScript ──
    tk('JavaScript This', ['variable.language.this.js', 'variable.language.this.ts'], '$onSurface'),
    tk('JavaScript Template Strings', ['string.template'], '$tertiary'),
    tk('TS Types', ['entity.name.type.ts'], '$onPrimaryContainer'),
    tk('TS Decorators', ['entity.other.decorator.ts'], '$tertiary'),

    // ── Language-specific: Rust ──
    tk('Rust Macros', ['support.macro.rust'], '$tertiary'),
    tk('Rust Lifetimes', ['entity.name.lifetime.rust', 'punctuation.definition.lifetime.rust'], '$tertiary'),
    tk('Rust Attributes', ['meta.attribute.rust'], '$onSurfaceVariant'),
    tk('Rust Types', ['entity.name.type.rust'], '$onPrimaryContainer'),
    tk('Rust Impl', ['entity.name.impl.rust'], '$secondary'),

    // ── Language-specific: Go ──
    tk('Go Package', ['entity.name.package.go'], '$secondary'),
    tk('Go Functions', ['entity.name.function.go'], '$secondary'),
    tk('Go Types', ['entity.name.type.go'], '$onPrimaryContainer'),

    // ── Language-specific: Swift ──
    tk('Swift Protocols', ['entity.name.protocol.swift'], '$onPrimaryContainer'),
    tk('Swift Argument Labels', ['keyword.other.argument.swift'], '$secondary'),

    // ── Language-specific: Dart ──
    tk('Dart Types', ['entity.name.type.dart'], '$onPrimaryContainer'),
    tk('Dart Class', ['entity.name.class.dart'], '$onPrimaryContainer'),

    // ── Regex ──
    tk('Regex', ['string.regexp'], '#88D8E3'),
    tk('Escape Characters', ['constant.character.escape'], '#88D8E3'),

    // ── Semantic Tokens ──
    tk('Semantic - Classes', ['class'], '$onPrimaryContainer'),
    tk('Semantic - Enums', ['enum'], '$onPrimaryContainer'),
    tk('Semantic - Interfaces', ['interface'], '$onPrimaryContainer'),
    tk('Semantic - Functions', ['function'], '$secondary'),
    tk('Semantic - Parameters', ['parameter'], '$onSurface'),
    tk('Semantic - Variables', ['variable'], '$onSurface'),
    tk('Semantic - Namespaces', ['namespace'], '$primary'),
  ];
}
