---
title: mp概括
createTime: 2024/12/21 17:14:39
permalink: /article/htkmb6op/
tags:
  - mybatisplus
  - mysql

---
> MyBatis Plus 是 MyBatis 的增强工具，旨在简化开发、提高效率，并提供一系列开箱即用的功能。它不仅继承了 MyBatis 的灵活性和强大功能，还通过添加自动化代码生成、内置 CRUD 操作、分页插件等特性进一步增强了开发者体验。

<!-- more -->

[[toc]]

# mybatis-plus





## mybatis-x使用

> 使用mybatis-x插件可以让我们快速的构建与数据表映射的java对象

使用步骤：

1. 使用idea database链接数据库

![image-20241220231855476](/images/mybatis/mybatisplus/image-20241220231855476.png)

2. 鼠标右击显示MybatisX-Generator

![image-20241220231927082](/images/mybatis/mybatisplus/image-20241220231927082.png)

3. 点击MybatisX-Generator

![image-20241220232204237](/images/mybatis/mybatisplus/image-20241220232204237.png)



4. 生成代码选择

**![image-20241220232313482](/images/mybatis/mybatisplus/image-20241220232313482.png)**

一般来说使用这些就足够了



## Mybatis-plus进行持久化操作

### IService

>
>
>IService 接口中的方法命名遵循了一定的规范，如 get 用于查询单行，remove 用于删除，list 用于查询集合，page 用于分页查询

#### save

```java
// 插入一条记录（选择字段，策略插入）
boolean save(T entity);
// 插入（批量）
boolean saveBatch(Collection<T> entityList);
// 插入（批量）
boolean saveBatch(Collection<T> entityList, int batchSize);
```

#### saveOrUpdate

> 保存或者更新

```java
// TableId 注解属性值存在则更新记录，否插入一条记录
boolean saveOrUpdate(T entity);
// 根据updateWrapper尝试更新，否继续执行saveOrUpdate(T)方法
boolean saveOrUpdate(T entity, Wrapper<T> updateWrapper);
// 批量修改插入
boolean saveOrUpdateBatch(Collection<T> entityList);
// 批量修改插入
boolean saveOrUpdateBatch(Collection<T> entityList, int batchSize);
```



**saveOrUpdate**[感觉不太行，执行两条命令，mysql8之后存在该命令]

```java
  Student student = Student.builder().id(1).age(18).name("aaa").build();
  studentService.saveOrUpdate(student);
```





#### remove

> 这个平时用来比较少

```java
// 根据 queryWrapper 设置的条件，删除记录
boolean remove(Wrapper<T> queryWrapper);
// 根据 ID 删除
boolean removeById(Serializable id);
// 根据 columnMap 条件，删除记录
boolean removeByMap(Map<String, Object> columnMap);
// 删除（根据ID 批量删除）
boolean removeByIds(Collection<? extends Serializable> idList);
```





#### update

```java
// 根据 UpdateWrapper 条件，更新记录 需要设置sqlset
boolean update(Wrapper<T> updateWrapper);
// 根据 whereWrapper 条件，更新记录
boolean update(T updateEntity, Wrapper<T> whereWrapper);
// 根据 ID 选择修改
boolean updateById(T entity);
// 根据ID 批量更新
boolean updateBatchById(Collection<T> entityList);
// 根据ID 批量更新
boolean updateBatchById(Collection<T> entityList, int batchSize);
```





#### get

> 这个主要使用getone 和list方法对于数据查询

```java
// 根据 ID 查询
T getById(Serializable id);
// 根据 Wrapper，查询一条记录。结果集，如果是多个会抛出异常，随机取一条加上限制条件 wrapper.last("LIMIT 1")
T getOne(Wrapper<T> queryWrapper);
// 根据 Wrapper，查询一条记录
T getOne(Wrapper<T> queryWrapper, boolean throwEx);
// 根据 Wrapper，查询一条记录
Map<String, Object> getMap(Wrapper<T> queryWrapper);
// 根据 Wrapper，查询一条记录
<V> V getObj(Wrapper<T> queryWrapper, Function<? super Object, V> mapper);
```



**getMap**

```java
Student student = Student.builder().id(1).age(18).name("aaa").build();
Map<String, Object> id = studentService.getMap(Wrappers.<Student>query().eq("id", 1));
// 数据返回结果，以map的形式存储
```

比如student中有id，age，name三个字段

```json	
{
    id:"1",
    age:18,
    name:"111"
}
```



**getObj**

```java
Student student = Student.builder().id(1).age(18).name("aaa").build();
QueryWrapper<Student> query =new QueryWrapper<>();
query.eq("id",1);
Integer obj1 = studentService.getObj(query, obj ->(Integer) obj);
System.out.println("obj = " + obj1);
```

这部分与官方文档所说内容并不一致，只是返回第一个字段，或者说是查询字段。



#### list

```java
// 查询所有
List<T> list();
// 查询列表
List<T> list(Wrapper<T> queryWrapper);
// 查询（根据ID 批量查询）
Collection<T> listByIds(Collection<? extends Serializable> idList);
// 查询（根据 columnMap 条件）
Collection<T> listByMap(Map<String, Object> columnMap);
// 查询所有列表
List<Map<String, Object>> listMaps();
// 查询列表
List<Map<String, Object>> listMaps(Wrapper<T> queryWrapper);
// 查询全部记录
List<Object> listObjs();
// 查询全部记录
<V> List<V> listObjs(Function<? super Object, V> mapper);
// 根据 Wrapper 条件，查询全部记录
List<Object> listObjs(Wrapper<T> queryWrapper);
// 根据 Wrapper 条件，查询全部记录
<V> List<V> listObjs(Wrapper<T> queryWrapper, Function<? super Object, V> mapper);
```

> 这部分平时使用会相对多一些

**listObj**s

```java
Student student = Student.builder().id(1).age(18).name("aaa").build();
QueryWrapper<Student> query =new QueryWrapper<>();
query.ge("id",1);
List<Integer> list = studentService.listObjs(query, x -> ((Integer) x));
System.out.println("list = " + list);
```

> 还是只能获得第一个字段的数据





#### page

> 这部分平时也会经常用到

```java
// 无条件分页查询
IPage<T> page(IPage<T> page);
// 条件分页查询
IPage<T> page(IPage<T> page, Wrapper<T> queryWrapper);
// 无条件分页查询
IPage<Map<String, Object>> pageMaps(IPage<T> page);
// 条件分页查询
IPage<Map<String, Object>> pageMaps(IPage<T> page, Wrapper<T> queryWrapper);
```

使用一般也就是page

**page**

```java
QueryWrapper<Student> query =new QueryWrapper<>();
query.ge("id",1);
IPage<Student> page = new Page<>();
IPage<Student> page1 = studentService.page(page, query);
System.out.println("list = " +page1 );
```



**pageMaps**

```java
QueryWrapper<Student> query =new QueryWrapper<>();
query.ge("id",1);
IPage<Map<String,Object>> page = new Page<>();
IPage<Map<String, Object>> mapIPage = studentService.pageMaps(page, query);
System.out.println("list = " +mapIPage );
```

> 将原先完整的数据student变成map存储





#### count

```java
// 查询总记录数
int count();
// 根据 Wrapper 条件，查询总记录数
int count(Wrapper<T> queryWrapper);

//自3.4.3.2开始,返回值修改为long
// 查询总记录数
long count();
// 根据 Wrapper 条件，查询总记录数
long count(Wrapper<T> queryWrapper);
```



### Mapper Interface

>
>
>BaseMapper 是 Mybatis-Plus 提供的一个通用 Mapper 接口，它封装了一系列常用的数据库操作方法，包括增、删、改、查等。通过继承 BaseMapper，开发者可以快速地对数据库进行操作，而无需编写繁琐的 SQL 语句。

#### insert

```java
// 插入一条记录
int insert(T entity);
```



#### delete

```java
// 根据 entity 条件，删除记录
int delete(@Param(Constants.WRAPPER) Wrapper<T> wrapper);
// 删除（根据ID 批量删除）
int deleteBatchIds(@Param(Constants.COLLECTION) Collection<? extends Serializable> idList);
// 根据 ID 删除
int deleteById(Serializable id);
// 根据 columnMap 条件，删除记录
int deleteByMap(@Param(Constants.COLUMN_MAP) Map<String, Object> columnMap);
```



#### update

```java
// 根据 whereWrapper 条件，更新记录
int update(@Param(Constants.ENTITY) T updateEntity, @Param(Constants.WRAPPER) Wrapper<T> whereWrapper);
// 根据 ID 修改
int updateById(@Param(Constants.ENTITY) T entity);
```





#### select

```java
// 根据 ID 查询
T selectById(Serializable id);
// 根据 entity 条件，查询一条记录
T selectOne(@Param(Constants.WRAPPER) Wrapper<T> queryWrapper);

// 查询（根据ID 批量查询）
List<T> selectBatchIds(@Param(Constants.COLLECTION) Collection<? extends Serializable> idList);
// 根据 entity 条件，查询全部记录
List<T> selectList(@Param(Constants.WRAPPER) Wrapper<T> queryWrapper);
// 查询（根据 columnMap 条件）
List<T> selectByMap(@Param(Constants.COLUMN_MAP) Map<String, Object> columnMap);
// 根据 Wrapper 条件，查询全部记录
List<Map<String, Object>> selectMaps(@Param(Constants.WRAPPER) Wrapper<T> queryWrapper);
// 根据 Wrapper 条件，查询全部记录。注意： 只返回第一个字段的值
List<Object> selectObjs(@Param(Constants.WRAPPER) Wrapper<T> queryWrapper);

// 根据 entity 条件，查询全部记录（并翻页）
IPage<T> selectPage(IPage<T> page, @Param(Constants.WRAPPER) Wrapper<T> queryWrapper);
// 根据 Wrapper 条件，查询全部记录（并翻页）
IPage<Map<String, Object>> selectMapsPage(IPage<T> page, @Param(Constants.WRAPPER) Wrapper<T> queryWrapper);
// 根据 Wrapper 条件，查询总记录数
Integer selectCount(@Param(Constants.WRAPPER) Wrapper<T> queryWrapper);
```

**selectMaps**

```java
 QueryWrapper<Student> query =new QueryWrapper<>();
query.ge("id",1);
BaseMapper<Student> baseMapper = studentService.getBaseMapper();
List<Map<String, Object>> maps = baseMapper.selectMaps(query);
System.out.println("list = " +maps );
```

> 同样是将数据映射成map



### chain

> Chain 是 Mybatis-Plus 提供的一种链式编程风格，它允许开发者以更加简洁和直观的方式编写数据库操作代码。Chain 分为 `query` 和 `update` 两大类，分别用于查询和更新操作。每类又分为普通链式和 lambda 链式两种风格，其中 lambda 链式提供了类型安全的查询条件构造

**query ** && update

```java
// 链式查询 普通
QueryChainWrapper<T> query();
// 链式查询 lambda 式。注意：不支持 Kotlin
LambdaQueryChainWrapper<T> lambdaQuery();

// 链式更改 普通
UpdateChainWrapper<T> update();
// 链式更改 lambda 式。注意：不支持 Kotlin
LambdaUpdateChainWrapper<T> lambdaUpdate();
```



demo

```java
LambdaQueryChainWrapper<Student> lambdaQueryChainWrapper =
                new LambdaQueryChainWrapper<>(studentService.getBaseMapper());
List<Student> list = lambdaQueryChainWrapper.ge(Student::getId, 1).list();
Student one = lambdaQueryChainWrapper.eq(Student::getId, 1).one();
```

> 目前感觉不是很有用





### ActiveRecord

> ActiveRecord 模式是一种设计模式，它允许实体类直接与数据库进行交互，实体类既是领域模型又是数据访问对象。在 Mybatis-Plus 中，实体类只需继承 `Model` 类即可获得强大的 CRUD 操作能力。
>
> **ActiveRecord** 是一种对象关系映射（ORM）模式，由 Rails 最早提出，广泛应用于动态语言如 PHP 和 Ruby 中。它遵循标准的 ORM 模型：表映射到记录，记录映射到对象，字段映射到对象属性。ActiveRecord 的主要思想是每一个数据库表对应一个类，类的每一个对象实例对应于数据库中表的一行记录[1](https://blog.csdn.net/LXZ_1024/article/details/123947000)[2](https://blog.csdn.net/qq_31762741/article/details/120392656)。
>
> 个人见解：就是将数据表完全映射成一个对象

删除

![image-20241221001910554](/images/mybatis/mybatisplus/image-20241221001910554.png)

insert

![image-20241221001929096](/images/mybatis/mybatisplus/image-20241221001929096.png)



select

![image-20241221002008540](/images/mybatis/mybatisplus/image-20241221002008540.png)



update

![image-20241221002029394](/images/mybatis/mybatisplus/image-20241221002029394.png)



> 经典的增删差改



### SimpleQuery

>
>
>SimpleQuery 是 Mybatis-Plus 提供的一个工具类，它对 `selectList` 查询后的结果进行了封装，使其可以通过 `Stream` 流的方式进行处理，从而简化了 API 的调用。
>
>SimpleQuery 的一个特点是它的 `peeks` 参数，这是一个可变参数，类型为 `Consumer...`，意味着你可以连续添加多个操作，这些操作会在查询结果被处理时依次执行。

```java
QueryWrapper<Student> query =new QueryWrapper<>();
        query.ge("id",1);
        List<String> names = new ArrayList<>();
       SimpleQuery.list(Wrappers.lambdaQuery(Student.class),// 查询条件
                Student::getName,// 提取字段
                System.out::println,// peek操作
                student -> names.add(student.getName())); // peek
        System.out.println("names = " + names);
```





**keymap**

```java
// 假设有一个 User 实体类和对应的 BaseMapper
LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
queryWrapper.eq(User::getStatus, "active"); // 查询状态为 "active" 的用户

// 使用 keyMap 方法查询并封装结果
Map<String, User> userMap = SimpleQuery.keyMap(
    queryWrapper, // 查询条件构造器
    User::getUsername, // 使用用户名作为键
    user -> System.out.println("Processing user: " + user.getUsername()) // 打印处理的用户名
);

// 遍历结果
for (Map.Entry<String, User> entry : userMap.entrySet()) {
    System.out.println("Key: " + entry.getKey() + ", Value: " + entry.getValue());
}
```



**map**

```java
// 假设有一个 User 实体类和对应的 BaseMapper
LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
queryWrapper.eq(User::getStatus, "active"); // 查询状态为 "active" 的用户

// 使用 map 方法查询并封装结果
Map<String, Integer> userMap = SimpleQuery.map(
    queryWrapper, // 查询条件构造器
    User::getUsername, // 使用用户名作为键
    User::getAge, // 使用年龄作为值
    user -> System.out.println("Processing user: " + user.getUsername()) // 打印处理的用户名
);

// 遍历结果
for (Map.Entry<String, Integer> entry : userMap.entrySet()) {
    System.out.println("Username: " + entry.getKey() + ", Age: " + entry.getValue());
}
```





**group**

```java
// 假设有一个 User 实体类和对应的 BaseMapper
LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
queryWrapper.eq(User::getStatus, "active"); // 查询状态为 "active" 的用户

// 使用 group 方法查询并封装结果，按照用户名分组
Map<String, List<User>> userGroup = SimpleQuery.group(
    queryWrapper, // 查询条件构造器
    User::getUsername, // 使用用户名作为分组键
    user -> System.out.println("Processing user: " + user.getUsername()) // 打印处理的用户名
);

// 遍历结果
for (Map.Entry<String, List<User>> entry : userGroup.entrySet()) {
    System.out.println("Username: " + entry.getKey());
    for (User user : entry.getValue()) {
        System.out.println(" - User: " + user);
    }
}
```





**list**

```java
// 假设有一个 User 实体类和对应的 BaseMapper
LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
queryWrapper.eq(User::getStatus, "active"); // 查询状态为 "active" 的用户

// 使用 list 方法查询并封装结果，提取所有用户的用户名
List<String> userNames = SimpleQuery.list(
    queryWrapper, // 查询条件构造器
    User::getUsername, // 提取用户名作为列表元素
    user -> System.out.println("Processing user: " + user.getUsername()) // 打印处理的用户名
);

// 遍历结果
for (String username : userNames) {
    System.out.println("Username: " + username);
}
```

### Db Kit

> Db Kit 是 Mybatis-Plus 提供的一个工具类，它允许开发者通过静态调用的方式执行 CRUD 操作，从而避免了在 Spring 环境下可能出现的 Service 循环注入问题，简化了代码，提升了开发效率。



正如概括所说这是一个工具，可以静态调用crud操作

```java
Student byId = Db.getById(1, Student.class);
System.out.println("byId = " + byId);
Db.update(Student.builder().id(1).name("222").age(18).build(),
Wrappers.<Student>lambdaUpdate().eq(Student::getId,1));
```





## 条件构造器（wrapper）

**mybatis-plus部分构造器关系图**

![image-20241221111328752](/images/mybatis/mybatisplus/image-20241221111328752.png)

对于平时开发主要使用还是lambdawrapper 和 wrapper



### wrapper

#### alleq

> 通过使用map构造all  eq 条件

适用于：

- LambdaWrapper【LambdaQueryWrapper，LambdaUpdateWrapper】
- Wrapper【QueryWrapper，UpdateWrapper】

```java
// 设置所有字段的相等条件，如果字段值为null，则根据null2IsNull参数决定是否设置为IS NULL
allEq(Map<String, Object> params)
allEq(Map<String, Object> params, boolean null2IsNull)
allEq(boolean condition, Map<String, Object> params, boolean null2IsNull)

// 设置所有字段的相等条件，通过filter过滤器决定哪些字段应该被包含，如果字段值为null，则根据null2IsNull参数决定是否设置为IS NULL
allEq(BiPredicate<String, Object> filter, Map<String, Object> params)
allEq(BiPredicate<String, Object> filter, Map<String, Object> params, boolean null2IsNull)
allEq(boolean condition, BiPredicate<String, Object> filter, Map<String, Object> params, boolean null2IsNull)
```

**参数说明**

- `params`：一个 `Map`，其中 `key` 是数据库字段名，`value` 是对应的字段值。
- `null2IsNull`：如果设置为 `true`，当 `Map` 中的 `value` 为 `null` 时，会调用 `isNull` 方法；如果设置为 `false`，则会忽略 `value` 为 `null` 的键值对。
- `filter`：一个 `BiPredicate`，用于过滤哪些字段应该被包含在查询条件中。
- `condition`：一个布尔值，用于控制是否应用这些条件。



#### eq

gt、ge、lt、le、ne、between、notbetween、like、likelift、likeright、isNull、in

> 这些都差不多

> 设置eq条件

**作用范围all**

```java
// 设置指定字段的相等条件
eq(R column, Object val)

// 根据条件设置指定字段的相等条件
eq(boolean condition, R column, Object val)
```



#### sql

inSql、notinSql、eqSql、geSql、leSql

> 允许使用sql的形式进行查询条件的构造





#### groupBy

> 用来进行分组查询的sql

```java
QueryWrapper<Student> queryWrapper = new QueryWrapper<>();
queryWrapper.select("name", "count(*)"); // 假设'id'是主键列名，你可根据实际情况调整
queryWrapper.groupBy("name");
BaseMapper<Student> mapper = studentService.getBaseMapper();
List<Map<String, Object>> maps = mapper.selectMaps(queryWrapper);
```

> SELECT name, max(age) as ages FROM `student` GROUP BY `name`

```java
// 设置 HAVING 子句，使用 SQL 语句和参数
having(String sqlHaving, Object... params)
having(boolean condition, String sqlHaving, Object... params)
```





#### order

> 用来进行数据排序

```java
// 设置升序排序条件，使用字段名
orderByAsc(R... columns)
orderByAsc(boolean condition, R... columns)
// 设置降序排序条件，使用字段名
orderByDesc(R... columns)
orderByDesc(boolean condition, R... columns)
// 设置排序条件，使用字段名和排序方向
orderBy(boolean condition, boolean isAsc, R... columns)
    
```



#### func

> `func` 方法是 MyBatis-Plus 中用于构建查询条件的高级方法之一，它提供了一种在链式调用中根据条件执行不同查询操作的机制。通过传入一个 `Consumer` 函数式接口，`func` 方法允许你在不中断链式调用的情况下，根据条件执行不同的查询构建逻辑。

使用范围同上

这个还是挺有意思的

```java
Student build = Student.builder().age(25).build();
QueryWrapper<Student> queryWrapper = new QueryWrapper<>();
queryWrapper.func(i -> {
    if (build.getAge()>25){
        i.ge("age",25);
    }else {
        i.le("age",25);
    }
});
List<Student> list = this.studentService.list(queryWrapper);
```



#### or and

这个用的比较多，使用起来也比较简单。



#### nested

>允许你在wrapper构造一个独立的查询条件

#### apply

`apply` 方法是 MyBatis-Plus 中用于构建查询条件的高级方法之一，它允许你直接拼接 SQL 片段到查询条件中。这个方法特别适用于需要使用数据库函数或其他复杂 SQL 构造的场景。

#### exists

> `exists` 方法是 MyBatis-Plus 中用于构建查询条件的高级方法之一，它用于在查询中添加一个 EXISTS 子查询。通过调用 `exists` 方法，可以将一个完整的 SQL 子查询作为 EXISTS 条件添加到主查询中。

**普通 Wrapper (`QueryWrapper`)：**

```java
QueryWrapper<User> queryWrapper = new QueryWrapper<>();

queryWrapper.exists("select id from table where age = 1");
```

**Lambda Wrapper (`LambdaQueryWrapper`)：**

```java
LambdaQueryWrapper<User> lambdaQueryWrapper = new LambdaQueryWrapper<>();

lambdaQueryWrapper.exists("select id from table where age = 1");
```

**生成的 SQL**

```sql
-- 普通 Wrapper 和 Lambda Wrapper 生成的 SQL 相同

SELECT * FROM user WHERE EXISTS (select id from table where age = 1)
```





#### select

>`select` 方法是 MyBatis-Plus 中用于构建查询条件的高级方法之一，它用于设置查询的字段。通过调用 `select` 方法，可以指定在查询结果中包含哪些字段，从而实现字段级别的查询定制。

```java
QueryWrapper<Student> queryWrapper = new QueryWrapper<>();
queryWrapper.ge("age","18");
queryWrapper.select("id,name");
List<Student> list = this.studentService.list(queryWrapper);
```



### Wrappers

MyBatis-Plus 提供了 `Wrappers` 类，它是一个静态工厂类，用于快速创建 `QueryWrapper`、`UpdateWrapper`、`LambdaQueryWrapper` 和 `LambdaUpdateWrapper` 的实例。使用 `Wrappers` 可以减少代码量，提高开发效率。









## 流式查询

MyBatis-Plus 从 `3.5.4` 版本开始支持流式查询，这是 MyBatis 的原生功能，通过 `ResultHandler` 接口实现结果集的流式查询。这种查询方式适用于数据跑批或处理大数据的业务场景。

在 `BaseMapper` 中，新增了多个重载方法，包括 `selectList`, `selectByMap`, `selectBatchIds`, `selectMaps`, `selectObjs`，这些方法可以与流式查询结合使用。



```java
Page<Student> page = new Page<>(1, 1000);
        BaseMapper<Student> baseMapper = this.studentService.getBaseMapper();
        AtomicInteger count = new AtomicInteger(0);
        baseMapper.selectList(page, Wrappers.emptyWrapper(), new ResultHandler<Student>() {

            @Override
            public void handleResult(ResultContext<? extends Student> resultContext) {
                Student resultObject = resultContext.getResultObject();
                if (resultObject.getAge()>18){
                    count.incrementAndGet();
                }
            }
        });
```



## 自动填充字段数据

MyBatis-Plus 提供了一个便捷的自动填充功能，用于在插入或更新数据时自动填充某些字段，如创建时间、更新时间等。以下是如何使用这一功能的详细说明。



### demo

#### entity

```java
@TableName(value ="t_user")
@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class User implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Long id;


    private String nickName;
    /**
     * 用户名
     */
    @TableField(select = false)
    private String username;

    /**
     * 用户密码
     */
    private String password;

    /**
     * 用户描述
     */
    private String description;

    /**
     * 用户创建时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date createTime;

    /**
     * 用户修改时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)

    private Date updateTime;

    /**
     * 用户删除标识，0：正常，1：已删除
     */
    @TableField(fill = FieldFill.INSERT)
    private Integer delFlag;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}

```



#### config

```java
/**
 * @author lss
 * @description mybatis plus 配置
 * @createDate 2024/12/6-11:33
 */
@Configuration
public class MPConfig {
    /**
     * MyBatis-Plus MySQL 分页插件
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }

    /**
     * MyBatis-Plus 源数据自动填充类
     */
    @Bean
    @Primary
    public MyMetaObjectHandler myMetaObjectHandler() {
        return new MyMetaObjectHandler();
    }

    /**
     * MyBatis-Plus 源数据自动填充类
     * todo 自己傻逼了，这个使用需要添加注解，下次请先看文档
     */
    static class MyMetaObjectHandler implements MetaObjectHandler {

        @Override
        public void insertFill(MetaObject metaObject) {
            strictInsertFill(metaObject, "createTime", Date::new, Date.class);
            strictInsertFill(metaObject, "updateTime", Date::new, Date.class);
            strictInsertFill(metaObject, "delFlag", () -> 0, Integer.class);
        }

        @Override
        public void updateFill(MetaObject metaObject) {
            strictInsertFill(metaObject, "updateTime", Date::new, Date.class);
        }
    }
}

```





## 主键生成策率

### 概述

主键生成策略必须使用 `INPUT` 类型，这意味着主键值需要由用户在插入数据时提供。MyBatis-Plus 支持在父类中定义 `@KeySequence` 注解，子类可以继承使用。

从版本 3.3.0 开始，MyBatis-Plus 会自动识别主键类型，因此不再需要手动指定主键类型。

MyBatis-Plus 内置支持多种数据库的主键生成策略，包括：

- DB2KeyGenerator
- H2KeyGenerator
- KingbaseKeyGenerator
- OracleKeyGenerator
- PostgreKeyGenerator

如果内置的主键生成策略不能满足需求，可以通过实现 `IKeyGenerator` 接口来扩展自定义的主键生成策略。

### springboot配置

```java
@Bean
public IKeyGenerator keyGenerator() {
    return new H2KeyGenerator();
}

// 这个可以进行自定义处理
@Bean
public MybatisPlusPropertiesCustomizer plusPropertiesCustomizer() {
    return plusProperties -> plusProperties.getGlobalConfig().getDbConfig().setKeyGenerator(new H2KeyGenerator());
}
```





## SQL注入器

MyBatis-Plus 提供了灵活的机制来注入自定义的 SQL 方法，这通过 `sqlInjector` 全局配置实现。通过实现 `ISqlInjector` 接口或继承 `AbstractSqlInjector` 抽象类，你可以注入自定义的通用方法到 MyBatis 容器中。

- 可以添加自定义的sql语句
- 可以扩展basemapper



### 使用步骤



#### sqlInjector配置

```java
public interface ISqlInjector {

    /**
     * 检查SQL是否已经注入(已经注入过不再注入)
     *
     * @param builderAssistant mapper 构建助手
     * @param mapperClass      mapper 接口的 class 对象
     */
    void inspectInject(MapperBuilderAssistant builderAssistant, Class<?> mapperClass);
}
```

#### 步骤 1: 定义SQL

首先，你需要定义自定义方法的SQL语句。这通常在继承了`AbstractMethod`的类中完成，例如`MysqlInsertAllBatch`。

> 对于这部分本质上就是‘mybatis’的sql语句

```java
public class MysqlInsertAllBatch extends AbstractMethod {

    protected MysqlInsertAllBatch(String methodName) {
        super(methodName);
    }

    @Override
    public MappedStatement injectMappedStatement(Class<?> mapperClass, Class<?> modelClass, TableInfo tableInfo) {
        // 动态构建SQL语句
        String sql = "INSERT INTO " + tableInfo.getTableName() + "(" + StringUtils.join(tableInfo.getFieldList(), ",") + ") VALUES " +
                "(#{list[0].id}, #{list[0].name}, #{list[0].age}), " +
                "(#{list[1].id}, #{list[1].name}, #{list[1].age})";

        // 创建 SqlSource 对象
        SqlSource sqlSource = languageDriver.createSqlSource(configuration, sql, modelClass);

        // 注册自定义的批量插入方法到Mapper中
        return this.addInsertMappedStatement(mapperClass, modelClass, "mysqlInsertAllBatch", sqlSource, new NoKeyGenerator(), null, null);
    }
}
```

> todo::好像不支持动态sql语句



#### 步骤 2: 注册自定义方法

接下来，你需要创建一个类来继承`DefaultSqlInjector`，并重写`getMethodList`方法来注册你的自定义方法。

>对定义的method进行注册

```java
public class MyLogicSqlInjector extends DefaultSqlInjector {
    @Override
    public List<AbstractMethod> getMethodList(Configuration configuration, Class<?> mapperClass, TableInfo tableInfo) {
        List<AbstractMethod> methodList = super.getMethodList(configuration, mapperClass, tableInfo);
        methodList.add(new MysqlInsertAllBatch("mysqlInsertAllBatch"));
        return methodList;
    }
}
```





#### 步骤 3: 定义BaseMapper

然后，你需要在你的BaseMapper接口中定义自定义的方法。

```java
public interface MyBaseMapper<T> extends BaseMapper<T> {
    int mysqlInsertAllBatch(@Param("list") List<T> batchList);
}
```

#### 步骤 4: 配置SqlInjector

最后，你需要在配置文件中指定你的自定义SQL注入器。

>这个地方从原来的yaml配置改为了spring配置

```java
@Configuration
public class SqlInjectorConfig {
    @Bean
    public DefaultSqlInjector addSqlInjector(){
        return new MyLogicSqlInjector();
    }
}

```







## 类型处理【先占个位】



# mybatis-plugin使用【有时间再看】