---
title: easyexcel
createTime: 2024/12/21 23:37:43
permalink: /article/ij4twh57/
cover: ../images/tools/office/2024-12-21.jpg
tags:
  - excel
  - tool
  - java
---
> 最近实习，干了不少导出导入excel的需求，然后就去总结了一下，方便以后使用
<!-- more -->
[[toc]]

# easyexcel

> easyexcel 基于apache poi重写其中的解析逻辑，减少解析文件内存的占用，同时提供方便的api使用

easyexcel按照read、writer、web-[read、writer]开始学习



## read



对于读取xlsx文件有几种不同的方式

### 1.通过PageReadListener来控制读取

>  这里 需要指定读用哪个class去读，然后读取第一个sheet 文件流会自动关闭
>  这里默认每次会读取100条数据 然后返回过来 直接调用使用数据就行
> 具体需要返回多少行可以在`PageReadListener`的构造函数设置

```java
String path = "/demo/demo.xlsx";
        InputStream resourceAsStream = ReadTest.class.getResourceAsStream(path);
        EasyExcel.read(resourceAsStream, DemoData.class,new PageReadListener<DemoData>(
                dataList -> {
                    System.out.println(" = ");
                    for (DemoData x : dataList){
                        System.out.println(JSON.toJSONString(x));
                    }
                }
        )).sheet(0).doRead();
```





### 2.通过匿名内部类来读取

> 其实这个和上面差不多，只不过上面的ReadListener帮你实现了

```java
        EasyExcel.read(resourceAsStream, DemoData.class, new ReadListener<DemoData>() {
            /**
             * 单次缓存的数据量
             */
            public static final int BATCH_COUNT = 100;
            /**
             *临时存储
             */
            private List<DemoData> cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);

            @Override
            public void invoke(DemoData data, AnalysisContext context) {
                cachedDataList.add(data);
                if (cachedDataList.size() >= BATCH_COUNT) {
                    saveData();
                    // 存储完成清理 list
                    cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);
                }
            }

            @Override
            public void doAfterAllAnalysed(AnalysisContext context) {
                saveData();
            }

            /**
             * 加上存储数据库
             */
            private void saveData() {
                System.out.println("size:"+cachedDataList.size());
                System.out.println("success");
            }
        }).sheet().doRead();

```



### 3.自定义ReadListener

```java
/**
 * 模板的读取类
 *
 * @author Jiaju Zhuang
 */
// 有个很重要的点 DemoDataListener 不能被spring管理，要每次读取excel都要new,然后里面用到spring可以构造方法传进去
@Slf4j
public class DemoDataListener implements ReadListener<DemoData> {

    /**
     * 每隔5条存储数据库，实际使用中可以100条，然后清理list ，方便内存回收
     */
    private static final int BATCH_COUNT = 100;
    /**
     * 缓存的数据
     */
    private List<DemoData> cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);
    /**
     * 假设这个是一个DAO，当然有业务逻辑这个也可以是一个service。当然如果不用存储这个对象没用。
     */
    private DemoDAO demoDAO;

    public DemoDataListener() {
        // 这里是demo，所以随便new一个。实际使用如果到了spring,请使用下面的有参构造函数
        demoDAO = new DemoDAO();
    }

    /**
     * 如果使用了spring,请使用这个构造方法。每次创建Listener的时候需要把spring管理的类传进来
     *
     * @param demoDAO
     */
    public DemoDataListener(DemoDAO demoDAO) {
        this.demoDAO = demoDAO;
    }

    /**
     * 这个每一条数据解析都会来调用
     *
     * @param data    one row value. It is same as {@link AnalysisContext#readRowHolder()}
     * @param context
     */
    @Override
    public void invoke(DemoData data, AnalysisContext context) {
        log.info("解析到一条数据:{}", JSON.toJSONString(data));
        cachedDataList.add(data);
        // 达到BATCH_COUNT了，需要去存储一次数据库，防止数据几万条数据在内存，容易OOM
        if (cachedDataList.size() >= BATCH_COUNT) {
            saveData();
            // 存储完成清理 list
            cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);
        }
    }

    /**
     * 所有数据解析完成了 都会来调用
     *
     * @param context
     */
    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        // 这里也要保存数据，确保最后遗留的数据也存储到数据库
        saveData();
        log.info("所有数据解析完成！");
    }

    /**
     * 加上存储数据库
     */
    private void saveData() {
        log.info("{}条数据，开始存储数据库！", cachedDataList.size());
        demoDAO.save(cachedDataList);
        log.info("存储数据库成功！");
    }
}

```



### 4.reader读取sheet

> 此时需要自定义监听器

```java
try (ExcelReader excelReader = EasyExcel.read(fileName, DemoData.class, new DemoDataListener()).build()) {
            // 构建一个sheet 这里可以指定名字或者no
            ReadSheet readSheet = EasyExcel.readSheet(0).build();
            // 读取一个sheet
            excelReader.read(readSheet);
        }
```





### 5.指定读取xlsx文件的columns

**pojo**

> 通过@ExcelProperty来进行数据的绑定

```java
@Getter
@Setter
@EqualsAndHashCode
public class IndexOrNameData {
    @ExcelProperty(index = 1)
    private String string;
    @ExcelProperty(value = "日期标题")
    private Date date;
    @ExcelProperty(value = "数字标题")
    private Double doubleData;
}

```

**listener**

```java
@Slf4j
public class IndexOrNameDataListener extends AnalysisEventListener<IndexOrNameData> {
    /**
     * 每隔5条存储数据库，实际使用中可以100条，然后清理list ，方便内存回收
     */
    private static final int BATCH_COUNT = 5;
    private List<IndexOrNameData> cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);

    @Override
    public void invoke(IndexOrNameData data, AnalysisContext context) {
        log.info("解析到一条数据:{}", JSON.toJSONString(data));
        cachedDataList.add(data);
        if (cachedDataList.size() >= BATCH_COUNT) {
            saveData();
            cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);
        }
    }

    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        saveData();
        log.info("所有数据解析完成！");
    }

    /**
     * 加上存储数据库
     */
    private void saveData() {
        log.info("{}条数据，开始存储数据库！", cachedDataList.size());
        log.info("存储数据库成功！");
    }
}

```





### 6.读取所有的sheet

> 这里对于同一个sheet不会重复读取

```java
EasyExcel.read(fileName, DemoData.class, new DemoDataListener()).doReadAll();

=========================================================

// 写法1
try (ExcelReader excelReader = EasyExcel.read(fileName).build()) {
    // 这里为了简单 所以注册了 同样的head 和Listener 自己使用功能必须不同的Listener
    ReadSheet readSheet1 =
        EasyExcel.readSheet(0).head(DemoData.class).registerReadListener(new DemoDataListener()).build();
    ReadSheet readSheet2 =
        EasyExcel.readSheet(1).head(DemoData.class).registerReadListener(new DemoDataListener()).build();
    // 这里注意 一定要把sheet1 sheet2 一起传进去，不然有个问题就是03版的excel 会读取多次，浪费性能
    excelReader.read(readSheet1, readSheet2);
}
```



### 7.读取数据进行数据转换

**pojo**

```java

public class ConverterData {

    /**
     * 我自定义 转换器，不管数据库传过来什么 。我给他加上“自定义：”
     */
    @ExcelProperty(converter = CustomStringStringConverter.class)
    private String string;
    /**
     * 这里用string 去接日期才能格式化。我想接收年月日格式
     */
    @DateTimeFormat("yyyy年MM月dd日HH时mm分ss秒")
    private String date;
    /**
     * 我想接收百分比的数字
     */
    @NumberFormat("#.##%")
    private String doubleData;
}

```



**converter**

```java
public class CustomStringStringConverter implements Converter<String> {
    @Override
    public Class<?> supportJavaTypeKey() {
        return String.class;
    }

    @Override
    public CellDataTypeEnum supportExcelTypeKey() {
        return CellDataTypeEnum.STRING;
    }

    /**
     * 这里读的时候会调用
     *
     * @param context
     * @return
     */
    @Override
    public String convertToJavaData(ReadConverterContext<?> context) {
        return "aaa：" + context.getReadCellData().getStringValue();
    }

    /**
     * 这里是写的时候会调用 不用管
     *
     * @return
     */
    @Override
    public WriteCellData<?> convertToExcelData(WriteConverterContext<String> context) {
        return new WriteCellData<>(context.getValue());
    }

}

```

excel**使用**

```java
EasyExcel.read(resourceAsStream, ConverterData.class, new ConverterDataListener())
                // 这里注意 我们也可以registerConverter来指定自定义转换器， 但是这个转换变成全局了， 所有java为string,excel为string的都会用这个转换器。
                // 如果就想单个字段使用请使用@ExcelProperty 指定converter
                // .registerConverter(new CustomStringStringConverter())
                // 读取sheet
                .sheet().doRead();
// 如果在一个读取操作中调用了 registerConverter，那么这个转换器只会在当前的读取操作中生效
EasyExcel.read(resourceAsStream, ConverterData.class, new ConverterDataListener()).registerConverter(new CustomStringStringConverter())
.sheet().doRead();
```





### 8.处理head row

```java
EasyExcel.read(fileName, DemoData.class, new DemoDataListener()).sheet()
            // 这里可以设置1，因为头就是一行。如果多行头，可以设置其他值。不传入也可以，因为默认会根据DemoData 来解析，他没有指定头，也就是默认1行
            .headRowNumber(1).doRead();
```



### 9.获取head row 属性

> 在数据监听器里面重写invokeHead方法

```java
 @Override
            public void invokeHead(Map<Integer, ReadCellData<?>> headMap, AnalysisContext context) {
                System.out.println(JSON.toJSONString(headMap));
//                log.info("解析到一条头数据:{}", JSON.toJSONString(headMap));
                // 如果想转成成 Map<Integer,String>
                // 方案1： 不要implements ReadListener 而是 extends AnalysisEventListener
                // 方案2： 调用 ConverterUtils.convertToStringMap(headMap, context) 自动会转换
            }
```



### 10.读取extra data数据 && 读取公式 和 单元格类型 && 异常处理

> 这些不进行过多整理，用的少





### 11.同步读取数据 && csv读取

> 暂时也不进行处理



### 12.不使用对象接受数据

- 加泛型
- 使用map
- 继承AnalysisEventListener<Map<Integer, String>>
- 重写方法



```java
EasyExcel.read(resourceAsStream, new NoModelDataListener()).sheet().doRead();

```



## write

> 这部分是将java数据写入进行excel文件中



### 1.直接写

```java
String baseDir = "test1";
        String fileName = baseDir + File.separator + System.currentTimeMillis() + ".xlsx";

// 确保目标目录存在
File dir = new File(baseDir);
if (!dir.exists()) {
    dir.mkdirs(); // 创建所有必要的父目录
}

EasyExcel.write(fileName, DemoData.class)
        .sheet("template")
        .doWrite(data());
```





### 2.忽略不需要的字段 && 添加字段

> 在导出数据的时候，如果有不需要导出

```java
Set<String> excludeColumnFieldNames = new HashSet<>();
        excludeColumnFieldNames.add("date");
        // 这里 需要指定写用哪个class去写，然后写到第一个sheet，名字为模板 然后文件流会自动关闭
        EasyExcel.write(fileName, DemoData.class).excludeColumnFieldNames(excludeColumnFieldNames).sheet("模板")
                .doWrite(data());
===================================================================================
Set<String> includeColumnFieldNames = new HashSet<>();
        includeColumnFieldNames.add("date");
        // 这里 需要指定写用哪个class去写，然后写到第一个sheet，名字为模板 然后文件流会自动关闭
        EasyExcel.write(fileName, DemoData.class).includeColumnFieldNames(includeColumnFieldNames).sheet("模板")
            .doWrite(data());
```





### 3.指定列写入

```java
EasyExcel.write(fileName, IndexData.class).sheet("模板").doWrite(data());
```

**pojo**

```java
@Getter
@Setter
@EqualsAndHashCode
public class IndexData {
    @ExcelProperty(value = "字符串标题", index = 0)
    private String string;
    @ExcelProperty(value = "日期标题", index = 1)
    private Date date;
    /**
     * 这里设置3 会导致第二列空的
     */
    @ExcelProperty(value = "数字标题", index = 3)
    private Double doubleData;
}
```



### 4.重复写入数据

```java
try (ExcelWriter excelWriter = EasyExcel.write(fileName, DemoData.class).build()) {
            // 去调用写入,这里我调用了五次，实际使用时根据数据库分页的总的页数来。这里最终会写到5个sheet里面
            for (int i = 0; i < 5; i++) {
                // 每次都要创建writeSheet 这里注意必须指定sheetNo 而且sheetName必须不一样
                WriteSheet writeSheet = EasyExcel.writerSheet(i, "模板" + i).build();
                // 分页去数据库查询数据 这里可以去数据库查询每一页的数据
                List<DemoData> data = data();
                excelWriter.write(data, writeSheet);
            }
        }

===================================================================================

try (ExcelWriter excelWriter = EasyExcel.write(fileName).build()) {
    // 去调用写入,这里我调用了五次，实际使用时根据数据库分页的总的页数来。这里最终会写到5个sheet里面
    for (int i = 0; i < 5; i++) {
        // 每次都要创建writeSheet 这里注意必须指定sheetNo 而且sheetName必须不一样。这里注意DemoData.class 可以每次都变，我这里为了方便 所以用的同一个class
        // 实际上可以一直变
        WriteSheet writeSheet = EasyExcel.writerSheet(i, "模板" + i).head(DemoData.class).build();
        // 分页去数据库查询数据 这里可以去数据库查询每一页的数据
        List<DemoData> data = data();
        excelWriter.write(data, writeSheet);
    }
}
```



### 5.数据转换 & 图片导出 & 单元格样式

> 等以后用到再说





### 6.使用模板写入数据

> 这个在开发的时候用的还是比较多的

```java
EasyExcel.write(fileName, DemoData.class).withTemplate(resourceAsStream).sheet().doWrite(data());
// resourceAsStream 数据模板
// data() 数据源
```





### 7.excel 列宽 &  style[color、font、bgc...] & 自定义实现head，content样式 & 合并单元格 & comment、url等

> 用的少



## web excel 处理

### download

```java
@GetMapping("download")
    public void download(HttpServletResponse response) throws IOException {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setCharacterEncoding("utf-8");
        String fileName = URLEncoder.encode("测试", "UTF-8").replaceAll("\\+", "%20");
        response.setHeader("Content-disposition", "attachment;filename*=utf-8''" + fileName + ".xlsx");

        EasyExcel.write(response.getOutputStream(), DownloadData.class).sheet("模板").doWrite(data());

    }
```

### download失败

```java
 @GetMapping("downloadFailedUsingJson")
    public void downloadFailedUsingJson(HttpServletResponse response) throws IOException {
        // 这里注意 有同学反应使用swagger 会导致各种问题，请直接用浏览器或者用postman
        try {
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setCharacterEncoding("utf-8");
            // 这里URLEncoder.encode可以防止中文乱码 当然和easyexcel没有关系
            String fileName = URLEncoder.encode("测试", "UTF-8").replaceAll("\\+", "%20");
            response.setHeader("Content-disposition", "attachment;filename*=utf-8''" + fileName + ".xlsx");
            // 这里需要设置不关闭流
            EasyExcel.write(response.getOutputStream(), DownloadData.class).autoCloseStream(Boolean.FALSE).sheet("模板")
                .doWrite(data());
        } catch (Exception e) {
            // 重置response
            response.reset();
            response.setContentType("application/json");
            response.setCharacterEncoding("utf-8");
            Map<String, String> map = MapUtils.newHashMap();
            map.put("status", "failure");
            map.put("message", "下载文件失败" + e.getMessage());
            response.getWriter().println(JSON.toJSONString(map));
        }
    }
```





### upload文件处理

> 对于这部分核心在于listener

```java
@PostMapping("upload")
    @ResponseBody
    public String upload(MultipartFile file) throws IOException {
        EasyExcel.read(file.getInputStream(), UploadData.class, new UploadDataListener(uploadDAO)).sheet().doRead();
        return "success";
    }
```

**listener**

> 注意这里不被spring管理

```java
// 有个很重要的点 DemoDataListener 不能被spring管理，要每次读取excel都要new,然后里面用到spring可以构造方法传进去
@Slf4j
public class UploadDataListener implements ReadListener<UploadData> {
    /**
     * 每隔5条存储数据库，实际使用中可以100条，然后清理list ，方便内存回收
     */
    private static final int BATCH_COUNT = 5;
    private List<UploadData> cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);
    /**
     * 假设这个是一个DAO，当然有业务逻辑这个也可以是一个service。当然如果不用存储这个对象没用。
     */
    private UploadDAO uploadDAO;

    public UploadDataListener() {
        // 这里是demo，所以随便new一个。实际使用如果到了spring,请使用下面的有参构造函数
        uploadDAO = new UploadDAO();
    }

    /**
     * 如果使用了spring,请使用这个构造方法。每次创建Listener的时候需要把spring管理的类传进来
     *
     * @param uploadDAO
     */
    public UploadDataListener(UploadDAO uploadDAO) {
        this.uploadDAO = uploadDAO;
    }

    /**
     * 这个每一条数据解析都会来调用
     *
     * @param data    one row value. It is same as {@link AnalysisContext#readRowHolder()}
     * @param context
     */
    @Override
    public void invoke(UploadData data, AnalysisContext context) {
        log.info("解析到一条数据:{}", JSON.toJSONString(data));
        cachedDataList.add(data);
        // 达到BATCH_COUNT了，需要去存储一次数据库，防止数据几万条数据在内存，容易OOM
        if (cachedDataList.size() >= BATCH_COUNT) {
            saveData();
            // 存储完成清理 list
            cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);
        }
    }

    /**
     * 所有数据解析完成了 都会来调用
     *
     * @param context
     */
    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        // 这里也要保存数据，确保最后遗留的数据也存储到数据库
        saveData();
        log.info("所有数据解析完成！");
    }

    /**
     * 加上存储数据库
     */
    private void saveData() {
        log.info("{}条数据，开始存储数据库！", cachedDataList.size());
        uploadDAO.save(cachedDataList);
        log.info("存储数据库成功！");
    }
}

```





## excel 模板填充功能

> 等以后用到了在总结







## ReadListener &&  AnalysisEventListener

![image-20241221233435632](/images/tools/office/image-20241221233435632.png)

`ReadListener` 和 `AnalysisEventListener` 是 EasyExcel 提供的两种不同的监听器接口，用于处理 Excel 文件读取过程中的事件。虽然它们都用于监听 Excel 数据解析的过程，但它们在设计和使用场景上有一些关键的区别。

### ReadListener

- **适用范围**：适用于简单的读取场景。
- **实现方式**：继承自 `com.alibaba.excel.read.listener.ReadListener` 接口。
- 主要方法
  - `invoke(T data, AnalysisContext context)`：每当解析到一行数据时调用。`data` 参数是解析后的 Java 对象，`context` 提供了上下文信息。
  - `doAfterAllAnalysed(AnalysisContext context)`：当所有数据解析完成后调用。可以在这里进行最终的清理或总结操作。

`ReadListener` 更加简洁，适合不需要复杂逻辑处理的情况。它内部已经实现了对缓存、批量插入等的支持，因此对于大多数常规需求来说足够使用。

### AnalysisEventListener

- **适用范围**：适用于需要更细粒度控制的场景，例如大数据量的文件读取、复杂的业务逻辑处理等。
- **实现方式**：继承自 `com.alibaba.excel.event.AnalysisEventListener` 抽象类。
- 主要方法
  - `invoke(Object object, AnalysisContext context)`：与 `ReadListener` 的 `invoke` 方法类似，但在 `AnalysisEventListener` 中更加灵活，因为它直接接收原始的 `Object` 类型，并且允许开发者自行定义如何将这些对象转换为业务模型。
  - `invokeHeadMap(Map<Integer, String> headMap, AnalysisContext context)`：当解析到表头时调用，可以用来获取列名及其对应的索引位置。
  - `doAfterAllAnalysed(AnalysisContext context)`：与 `ReadListener` 的同名方法功能相同。
  - `onException(Exception exception, AnalysisContext context)`：当解析过程中发生异常时调用，允许捕获并处理异常而不中断整个读取流程。

`AnalysisEventListener` 提供了更多的灵活性和控制权，尤其是在处理非常大的 Excel 文件时，您可以更好地管理内存使用和性能优化。此外，它还提供了处理异常的机会，使得代码更具健壮性。

### 选择哪个？

- 如果只需要简单地读取 Excel 文件并将每一行的数据保存到数据库或其他存储中，那么 `ReadListener` 可能是一个更好的选择，因为它更简单易用。
- 如果您需要处理更大规模的数据集、执行复杂的业务逻辑、或者对解析过程有特殊要求（如**错误处理**），则应该考虑使用 `AnalysisEventListener`。