var _ = require("underscore")

var Sqlite3 = require("sqlite3")
var db = new Sqlite3.Database(":memory:")
db.serialize()

var Shared = require("./shared")
var attributes = require("..").sqlite3

describe("SQLite3", function() {
  beforeEach(function(done) { db.run("BEGIN TRANSACTION", done) })
  afterEach(function(done) { db.run("ROLLBACK TRANSACTION", done) })

  describe("given a simple table", function() {
    Shared.mustPassSimpleTable(withSql)
  })

  describe("type", function() {
    _({
      BIGINT: Number,
      BLOB: String,
      BOOLEAN: Boolean,
      CHARACTER: String,
      CLOB: String,
      DATE: Date,
      DATETIME: Date,
      DECIMAL: Number,
      DOUBLE: Number,
      "DOUBLE PRECISION": Number,
      FLOAT: Number,
      INT2: Number,
      INT8: Number,
      INT: Number,
      INTEGER: Number,
      MEDIUMINT: Number,
      "NATIVE CHARACTER": String,
      NCHAR: String,
      NUMERIC: Number,
      NVARCHAR: String,
      REAL: Number,
      SMALLINT: Number,
      TEXT: String,
      TINYINT: Number,
      "UNSIGNED BIG INT": Number,
      VARCHAR: String,
      "VARYING CHARACTER": String,
    }).each(function(klass, type) {
      describe("given " + type, function() {
        withSql('CREATE TABLE "test" ("foo" ' + type + ')')

        it("must be set to " + klass.name, function() {
          this.attrs.foo.type.must.equal(klass)
        })
      })
    })

    describe("given differently cased type", function() {
      withSql('CREATE TABLE "test" ("foo" Date)')

      it("must be set properly", function() {
        this.attrs.foo.type.must.equal(Date)
      })
    })

    describe("given CUSTOM", function() {
      withSql('CREATE TABLE "test" ("foo" CUSTOM)')

      it("must be set to String", function() {
        this.attrs.foo.type.must.equal(String)
      })
    })
  })

  describe("default", function() {
    describe("given NULL", function() {
      withSql('CREATE TABLE "test" ("foo" INTEGER DEFAULT NULL)')

      it("must be set to null", function() {
        this.attrs.foo.must.have.property("default", null)
      })
    })

    describe("given null", function() {
      withSql('CREATE TABLE "test" ("foo" INTEGER DEFAULT null)')

      it("must be set to null", function() {
        this.attrs.foo.must.have.property("default", null)
      })
    })

    describe("given expression", function() {
      withSql('CREATE TABLE "test" ("foo" TEXT DEFAULT (1 + 2))')

      it("must be set to null", function() {
        this.attrs.foo.must.have.property("default", null)
      })
    })

    describe("of TEXT column", function() {
      describe("given string surrounded by '", function() {
        withSql('CREATE TABLE "test" ("foo" TEXT DEFAULT \'a b c\')')

        it("must be set", function() {
          this.attrs.foo.default.must.equal("a b c")
        })
      })

      describe("given ' surrounded by \"", function() {
        withSql('CREATE TABLE "test" ("foo" TEXT DEFAULT "\'")')

        it("must be set to '", function() {
          this.attrs.foo.default.must.equal("'")
        })
      })

      describe("given '' surrounded by '", function() {
        withSql('CREATE TABLE "test" ("foo" TEXT DEFAULT \'\'\'\')')

        it("must be set to '", function() {
          this.attrs.foo.default.must.equal("'")
        })
      })

      describe("given '' surrounded by \"", function() {
        withSql('CREATE TABLE "test" ("foo" TEXT DEFAULT "\'\'")')

        it("must be set to ''", function() {
          this.attrs.foo.default.must.equal("''")
        })
      })

      describe("given \" surrounded by '", function() {
        withSql('CREATE TABLE "test" ("foo" TEXT DEFAULT \'"\')')

        it("must be set to \"", function() {
          this.attrs.foo.default.must.equal("\"")
        })
      })

      describe("given \"\" surrounded by \"", function() {
        withSql('CREATE TABLE "test" ("foo" TEXT DEFAULT """")')

        it("must be set to \"", function() {
          this.attrs.foo.default.must.equal("\"")
        })
      })

      describe("given \"\" surrounded by '", function() {
        withSql('CREATE TABLE "test" ("foo" TEXT DEFAULT \'""\')')

        it("must be set to \"\"", function() {
          this.attrs.foo.default.must.equal("\"\"")
        })
      })

      describe("given custom", function() {
        withSql('CREATE TABLE "test" ("foo" TEXT DEFAULT custom)')

        it("must be set to null", function() {
          this.attrs.foo.must.have.property("default", null)
        })
      })
    })

    describe("of INTEGER column", function() {
      describe("given 42", function() {
        withSql('CREATE TABLE "test" ("foo" INTEGER DEFAULT 42)')

        it("must be set to 42", function() {
          this.attrs.foo.must.have.property("default", 42)
        })
      })
    })

    describe("of REAL column", function() {
      describe("given 42.69", function() {
        withSql('CREATE TABLE "test" ("foo" REAL DEFAULT 42.69)')

        it("must be set to 42.69", function() {
          this.attrs.foo.must.have.property("default", 42.69)
        })
      })

      describe("given 42e3", function() {
        withSql('CREATE TABLE "test" ("foo" REAL DEFAULT 42e3)')

        it("must be set to 42000", function() {
          this.attrs.foo.must.have.property("default", 42000)
        })
      })

      describe("given 42.511e3", function() {
        withSql('CREATE TABLE "test" ("foo" REAL DEFAULT 42.511e3)')

        it("must be set to 42511", function() {
          this.attrs.foo.must.have.property("default", 42511)
        })
      })

      describe("given 42.", function() {
        withSql('CREATE TABLE "test" ("foo" REAL DEFAULT 42.)')

        it("must be set to 42", function() {
          this.attrs.foo.must.have.property("default", 42)
        })
      })

      describe("given .42", function() {
        withSql('CREATE TABLE "test" ("foo" REAL DEFAULT .42)')

        it("must be set to 0.42", function() {
          this.attrs.foo.must.have.property("default", .42)
        })
      })

      describe("given 42.e3", function() {
        withSql('CREATE TABLE "test" ("foo" REAL DEFAULT 42.e3)')

        it("must be set to 42000", function() {
          this.attrs.foo.must.have.property("default", 42000)
        })
      })

      describe("given -42.e3", function() {
        withSql('CREATE TABLE "test" ("foo" REAL DEFAULT -42.e3)')

        it("must be set to -42000", function() {
          this.attrs.foo.must.have.property("default", -42000)
        })
      })
    })

    describe("of BOOLEAN column", function() {
      describe("given 1", function() {
        withSql('CREATE TABLE "test" ("foo" BOOLEAN DEFAULT 1)')

        it("must be set to true", function() {
          this.attrs.foo.must.have.property("default", true)
        })
      })

      describe("given 0", function() {
        withSql('CREATE TABLE "test" ("foo" BOOLEAN DEFAULT 0)')

        it("must be set to false", function() {
          this.attrs.foo.must.have.property("default", false)
        })
      })
    })

    describe("of DATE column", function() {
      describe("given 86400", function() {
        withSql('CREATE TABLE "test" ("foo" DATETIME DEFAULT 86400)')

        it("must be set to null", function() {
          this.attrs.foo.must.have.property("default", null)
        })
      })
    })

    describe("of DATETIME column", function() {
      describe("given 86400", function() {
        withSql('CREATE TABLE "test" ("foo" DATETIME DEFAULT 86400)')

        it("must be set to null", function() {
          this.attrs.foo.must.have.property("default", null)
        })
      })
    })

    describe("of CUSTOM column", function() {
      describe("given string surrounded by '", function() {
        withSql('CREATE TABLE "test" ("foo" CUSTOM DEFAULT \'a b c\')')

        it("must be set", function() {
          this.attrs.foo.default.must.equal("a b c")
        })
      })
    })
  })

  function withSql(sql, fn) {
    beforeEach(db.run.bind(db, sql))
    beforeEach(withAttrs(function(attrs) { this.attrs = attrs }))
  }

  function withAttrs(fn) {
    return function(done) {
      var self = this
      attributes(db, "test", function(err, attrs) {
        if (err) return done(err)
        fn.call(self, attrs)
        done()
      })
    }
  }
})
